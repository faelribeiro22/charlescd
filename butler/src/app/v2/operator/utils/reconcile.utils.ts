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

import { KubernetesObject } from '@kubernetes/client-node'
import { ComponentEntityV2 } from '../../api/deployments/entity/component.entity'

export class ReconcileUtils {

  public static getCreatedAtTimeDiff(component1: ComponentEntityV2, component2: ComponentEntityV2): number {
    return component1.deployment.createdAt.getTime() - component2.deployment.createdAt.getTime()
  }

  public static isNameAndKindEqual(manifest1: KubernetesObject, manifest2: KubernetesObject): boolean {
    return manifest1.metadata?.name === manifest2.metadata?.name && manifest1.kind === manifest2.kind
  }

  public static getComponentsServiceManifests(components: ComponentEntityV2[]): KubernetesObject[]  {
    return components.flatMap(c => c.manifests).filter(m => m.kind === 'Service')
  }
}
