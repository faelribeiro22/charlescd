package io.charlescd.moove.application.deployment.impl

import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.deployment.FindDeploymentLogsInteractor
import io.charlescd.moove.application.deployment.response.SummarizedDeploymentHistoryResponse
import io.charlescd.moove.domain.PageRequest
import io.charlescd.moove.domain.repository.ComponentRepository
import io.charlescd.moove.domain.repository.DeploymentRepository
import io.charlescd.moove.infrastructure.service.client.DeployClient
import io.charlescd.moove.infrastructure.service.client.response.LogResponse
import javax.inject.Named

@Named
class FindDeploymentLogsInteractorImpl(
    private val workspaceService: WorkspaceService,
    private val userService: UserService,
    private val deployClient: DeployClient
) : FindDeploymentLogsInteractor {
    override fun execute(workspaceId: String, authorization: String, deploymentId: String): LogResponse {
       this.userService.findByAuthorizationToken(authorization)
       return this.deployClient.getDeploymentLogs(workspaceId, deploymentId)
    }

}
