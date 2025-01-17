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

import { Http, Subset } from '../interfaces/k8s-manifest.interface'
import { Component } from '../../../api/deployments/interfaces'

const IstioManifestsUtils = {

  getDestinationRulesSubsetObject: (component: Component, circleId: string): Subset => {
    return {
      labels: {
        component: component.name,
        tag: component.imageTag,
        circleId: circleId,
        deploymentId: component.deployment.id
      },
      name: circleId
    }
  },

  getVirtualServiceHTTPCookieCircleRule: (name: string, tag: string, circle: string): Http => ({
    match: [
      {
        headers: {
          cookie: {
            regex: `.*x-circle-id=${circle}.*`
          }
        }
      }
    ],
    route: [
      {
        destination: {
          host: name,
          subset: circle
        },
        headers: {
          request: {
            set: {
              'x-circle-source': circle
            }
          },
          response: {
            set: {
              'x-circle-source': circle
            }
          }
        }
      }
    ]
  }),

  getVirtualServiceHTTPHeaderCircleRule: (name: string, tag: string, circle: string): Http => ({
    match: [
      {
        headers: {
          'x-circle-id': {
            exact: circle
          }
        }
      }
    ],
    route: [
      {
        destination: {
          host: name,
          subset: circle
        },
        headers: {
          request: {
            set: {
              'x-circle-source': circle
            }
          },
          response: {
            set: {
              'x-circle-source': circle
            }
          }
        }
      }
    ]
  }),
  getVirtualServiceHTTPDefaultRule: (name: string, circleId: string): Http => ({
    route: [
      {
        destination: {
          host: name,
          subset: circleId
        },
        headers: {
          request: {
            set: {
              'x-circle-source': circleId
            }
          },
          response: {
            set: {
              'x-circle-source': circleId
            }
          }
        }
      }
    ]
  })
}

export { IstioManifestsUtils }
