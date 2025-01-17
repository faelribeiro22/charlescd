/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { getConnection, UpdateResult } from 'typeorm'
import { DeploymentStatusEnum } from '../enums/deployment-status.enum'
import { QueuedDeploymentsConstraints } from '../../../core/integrations/databases/constraints'
import { MooveService } from '../../../core/integrations/moove'
import { ConsoleLoggerService } from '../../../core/logs/console/console-logger.service'
import { DateUtils } from '../../../core/utils/date.utils'
import { DeploymentNotificationRequestDto } from '../dto/deployment-notification-request.dto'
import { ComponentEntityV2 } from '../entity/component.entity'
import { DeploymentEntityV2 } from '../entity/deployment.entity'
import { Execution } from '../entity/execution.entity'
import { ExecutionTypeEnum } from '../enums'
import { ComponentsRepositoryV2 } from '../repository'
import { DeploymentRepositoryV2 } from '../repository/deployment.repository'
import { ExecutionRepository } from '../repository/execution.repository'
import { NotificationStatusEnum } from '../enums/notification-status.enum'
import { LogEntity } from '../entity/logs.entity'
import { LogRepository } from '../repository/log.repository'

export class ReceiveNotificationUseCase {

  constructor(
    @InjectRepository(DeploymentRepositoryV2)
    private deploymentRepository: DeploymentRepositoryV2,
    @InjectRepository(ComponentsRepositoryV2)
    private componentRepository: ComponentsRepositoryV2,
    @InjectRepository(ExecutionRepository)
    private executionRepository: ExecutionRepository,
    @InjectRepository(LogRepository)
    private logRepository: LogRepository,
    private readonly consoleLoggerService: ConsoleLoggerService,
    private mooveService: MooveService
  ) {}

  public async execute(executionId: string, deploymentNotificationDto: DeploymentNotificationRequestDto): Promise<Execution>{
    this.consoleLoggerService.log('START:RECEIVE_NOTIFICATION_USECASE', { executionId, notification: deploymentNotificationDto })
    switch (deploymentNotificationDto.type) {
      case ExecutionTypeEnum.DEPLOYMENT:
        return await this.handleDeploymentNotification(executionId, deploymentNotificationDto)
      case ExecutionTypeEnum.UNDEPLOYMENT:
        return await this.handleUndeploymentNotification(executionId, deploymentNotificationDto)
      default:
        this.consoleLoggerService.log('ERROR:INVALID_EXECUTION_TYPE', { type: deploymentNotificationDto.type })
        throw new Error('Invalid Execution Type')
    }
  }

  private async handleDeploymentNotification(executionId: string, deploymentNotificationDto: DeploymentNotificationRequestDto): Promise<Execution> {
    this.consoleLoggerService.log('START:HANDLE_DEPLOYMENT_NOTIFICATION')
    const execution = await this.executionRepository.findOneOrFail({ id: executionId }, { relations: ['deployment', 'deployment.components'] })
    const currentActiveDeployment = await this.deploymentRepository.findOne({ where: { circleId: execution.deployment.circleId, active: true } })
    const deploymentLogs = await this.getDeploymentLogs(deploymentNotificationDto, execution.deployment)
    execution.finishedAt = DateUtils.now()
    execution.deployment.components = execution.deployment.components.map(c => {
      c.running = false
      return c
    })

    if (deploymentNotificationDto.status === DeploymentStatusEnum.SUCCEEDED) {
      execution.status = DeploymentStatusEnum.SUCCEEDED
      execution.deployment.current = true
      if (currentActiveDeployment) {
        currentActiveDeployment.current = false
      }
    }

    if (deploymentNotificationDto.status === DeploymentStatusEnum.FAILED) {
      execution.status = DeploymentStatusEnum.FAILED
      execution.deployment.current = false
    }

    const savedExecution = await getConnection().transaction(async transactionManager => {
      try {
        if (currentActiveDeployment) {
          await transactionManager.update(DeploymentEntityV2, { id: currentActiveDeployment.id }, { current: currentActiveDeployment.current })
        }
        for await (const c of execution.deployment.components) {
          transactionManager.update(ComponentEntityV2, { id: c.id }, { running: c.running })
        }
        await transactionManager.update(DeploymentEntityV2, { id: execution.deployment.id }, { current  : execution.deployment.current })
        await transactionManager.update(Execution, { id: execution.id }, { status: execution.status, finishedAt: DateUtils.now() })
        await transactionManager.save(deploymentLogs)
        return execution
      }
      catch (error) {
        if (error.constraint === QueuedDeploymentsConstraints.ONLY_ONE_ACTIVE_PER_CIRCLE_AND_CONFIG) {
          this.consoleLoggerService.log('ERROR:Can only have one deployment active per circle')
          throw new InternalServerErrorException('Can only have one deployment active per circle')
        } else {
          this.consoleLoggerService.log('ERROR:Failed to save deployment')
          this.consoleLoggerService.log(error)
          throw new InternalServerErrorException
        }
      }
    })

    await this.notifyMooveAndUpdateDeployment(savedExecution)
    this.consoleLoggerService.log('FINISH:HANDLE_DEPLOYMENT_NOTIFICATION')
    return await this.executionRepository.findOneOrFail(savedExecution.id, { relations: ['deployment', 'deployment.components'] })
  }

  private async notifyMooveAndUpdateDeployment(execution: Execution): Promise<UpdateResult> {
    let notificationStatus
    if (execution.type === ExecutionTypeEnum.DEPLOYMENT) {
      notificationStatus = execution.status === DeploymentStatusEnum.SUCCEEDED ?
        NotificationStatusEnum.SUCCEEDED :
        NotificationStatusEnum.FAILED
    } else {
      notificationStatus = execution.status === DeploymentStatusEnum.SUCCEEDED ?
        NotificationStatusEnum.UNDEPLOYED :
        NotificationStatusEnum.UNDEPLOY_FAILED
    }

    const notificationResult = await this.sendMooveNotification(
      execution.id, //TODO unnecessary parameter
      notificationStatus,
      execution.deployment.callbackUrl,
      execution.incomingCircleId
    )
    const updatedDeployment = await this.executionRepository.updateNotificationStatus(execution.id, notificationResult.status)
    return updatedDeployment
  }

  private async sendMooveNotification(deploymentId: string, status: string, callbackUrl: string, circleId: string | null) {
    return await this.mooveService.notifyDeploymentStatusV2(
      deploymentId,
      status,
      callbackUrl,
      circleId
    )
  }

  private async handleUndeploymentNotification(executionId: string, deploymentNotificationDto: DeploymentNotificationRequestDto): Promise<Execution> {
    this.consoleLoggerService.log('START:HANDLE_UNDEPLOYMENT_NOTIFICATION')
    const execution = await this.executionRepository.findOneOrFail(executionId, { relations: ['deployment', 'deployment.components'] })
    const undeploymentLogs = await this.getDeploymentLogs(deploymentNotificationDto, execution.deployment)
    execution.finishedAt = DateUtils.now()
    execution.deployment.components = execution.deployment.components.map(c => {
      c.running = false
      return c
    })

    if (deploymentNotificationDto.status === DeploymentStatusEnum.SUCCEEDED) {
      execution.deployment.current = false
      execution.status = DeploymentStatusEnum.SUCCEEDED
    }

    if (deploymentNotificationDto.status === DeploymentStatusEnum.FAILED) {
      execution.status = DeploymentStatusEnum.FAILED
    }

    try {
      await this.deploymentRepository.save(execution.deployment)
      await this.componentRepository.save(execution.deployment.components)
      await this.logRepository.save(undeploymentLogs)
      const updatedExecution = await this.executionRepository.save(execution)
      await this.notifyMooveAndUpdateDeployment(updatedExecution)
      this.consoleLoggerService.log('FINISH:HANDLE_UNDEPLOYMENT_NOTIFICATION')
      return await this.executionRepository.findOneOrFail(updatedExecution.id, { relations: ['deployment', 'deployment.components'] })
    }
    catch (error) {
      this.consoleLoggerService.log('ERROR:FAILED_TO_SAVE_DEPLOYMENT')
      throw new InternalServerErrorException()
    }
  }

  private async getDeploymentLogs(deploymentNotificationDto: DeploymentNotificationRequestDto, deployment: DeploymentEntityV2) {
    return new LogEntity(deployment.id, deploymentNotificationDto.logs)
  }
}
