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

export default interface IEnvConfiguration {

  postgresHost: string

  postgresPort: number

  postgresUser: string

  postgresPass: string

  postgresDbName: string

  postgresSSL: boolean

  mooveUrl: string

  darwinNotificationUrl: string

  darwinUndeploymentCallbackUrl: string

  darwinDeploymentCallbackUrl: string

  darwinIstioDeploymentCallbackUrl: string

  helmTemplateUrl: string

  helmPrefixUrl: string

  helmRepoBranch: string

  deploymentExpireTime: number

  pgBossConfig: {
    host: string,
    database: string,
    user: string,
    password: string
    max: number
    retentionDays: number
  }

  butlerUrl: string

  butlerNamespace: string

  requestSizeLimit: string

  rejectUnauthorizedTLS: boolean
}
