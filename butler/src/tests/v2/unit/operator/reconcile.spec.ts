import 'jest'
import { ComponentEntityV2 } from '../../../../app/v2/api/deployments/entity/component.entity'
import { DeploymentEntityV2 } from '../../../../app/v2/api/deployments/entity/deployment.entity'
import { UrlConstants } from '../../integration/test-constants'
import { reconcileFixtures, reconcileFixturesParams } from './params'
import { ReconcileUtils } from '../../../../app/v2/operator/utils/reconcile.utils'


describe('Deployment on existing circle', () => {

  it('returns empty array for the first reconcile loop on same circle that already had deployments', () => {
    const params = reconcileFixturesParams.paramsWithPreviousDeployment
    const currentDeployment = reconcileFixtures.currentDeploymentId
    expect(ReconcileUtils.specsByDeployment(params, currentDeployment)).toEqual([])
  })

  it('returns list of previous deployment specs', () => {
    const params = reconcileFixturesParams.paramsWithPreviousDeployment
    const previousDeployment = reconcileFixtures.previousDeploymentId
    const ids = ReconcileUtils.specsByDeployment(params, previousDeployment).map(s => s.metadata.labels.deploymentId)
    expect(ids).toEqual([previousDeployment, previousDeployment])
  })

  it('returns false if current deployments specs are not ready but previous deployments are still running', () => {
    const params = reconcileFixturesParams.paramsWithPreviousDeployment
    const previousDeployment = reconcileFixtures.previousDeploymentId
    const currentDeployment = reconcileFixtures.currentDeploymentId
    const currentSpecs = ReconcileUtils.specsByDeployment(params, currentDeployment)
    const previousSpecs = ReconcileUtils.specsByDeployment(params, previousDeployment)
    expect(ReconcileUtils.checkConditions(currentSpecs)).toEqual(false)
    expect(ReconcileUtils.checkConditions(previousSpecs)).toEqual(true)
  })

  it('concatenates deployments and services from previous and current deployment', () => {
    const previousComponents = [
      new ComponentEntityV2(
        UrlConstants.helmRepository,
        'v1',
        'https://repository.com/B:v1',
        'B',
        '1c29210c-e313-4447-80e3-db89b2359138',
        null,
        null,
        [
          {
            kind: 'Deployment',
            metadata: {
              name: 'previous'
            }
          },
          {
            kind: 'Service',
            metadata: {
              name: 'previous'
            }
          },
          {
            kind: 'Deployment',
            metadata: {
              name: 'current-2'
            }
          },
          {
            kind: 'Service',
            metadata: {
              name: 'current-2'
            }
          }
        ]
      )
    ]
    const previousDeployment = new DeploymentEntityV2(
      reconcileFixtures.previousDeploymentId,
      'some-author',
      'ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
      'some-url',
      previousComponents,
      false,
      'my-namespace',
      5
    )

    const currentComponents = [
      {
        kind: 'Deployment',
        metadata: {
          name: 'current-ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
          namespace: 'my-namespace',
          labels: {
            'deploymentId': reconcileFixtures.currentDeploymentId,
            'circleId': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
          }
        }
      },
      {
        kind: 'Service',
        metadata: {
          name: 'current',
          namespace: 'my-namespace',
          labels: {
            'deploymentId': reconcileFixtures.currentDeploymentId,
            'circleId': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
          }
        }
      },
      {
        kind: 'Deployment',
        metadata: {
          name: 'current-2-ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
          namespace: 'my-namespace',
          labels: {
            'deploymentId': reconcileFixtures.currentDeploymentId,
            'circleId': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
          }
        }
      },
      {
        kind: 'Service',
        metadata: {
          name: 'current-2',
          namespace: 'my-namespace',
          labels: {
            'deploymentId': reconcileFixtures.currentDeploymentId,
            'circleId': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
          }
        }
      }
    ]
    const concat = ReconcileUtils.concatWithPrevious(previousDeployment, currentComponents)
    const expected = [
      {
        kind: 'Deployment',
        metadata: {
          name: 'current-ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
          namespace: 'my-namespace',
          labels: {
            'deploymentId': reconcileFixtures.currentDeploymentId,
            'circleId': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
          }
        }
      },
      {
        kind: 'Service',
        metadata: {
          name: 'current',
          namespace: 'my-namespace',
          labels: {
            'deploymentId': reconcileFixtures.currentDeploymentId,
            'circleId': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
          }
        }
      },
      {
        kind: 'Deployment',
        metadata: {
          name: 'current-2-ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
          namespace: 'my-namespace',
          labels: {
            'deploymentId': reconcileFixtures.currentDeploymentId,
            'circleId': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
          }
        }
      },
      {
        kind: 'Service',
        metadata: {
          name: 'current-2',
          namespace: 'my-namespace',
          labels: {
            'deploymentId': reconcileFixtures.currentDeploymentId,
            'circleId': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
          }
        }
      },
      {
        kind: 'Deployment',
        metadata: {
          name: 'previous-ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
          namespace: 'my-namespace',
          labels: {
            'deploymentId': reconcileFixtures.previousDeploymentId,
            'circleId': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
          }
        }
      },
      {
        kind: 'Service',
        metadata: {
          name: 'previous',
          namespace: 'my-namespace',
          labels: {
            'deploymentId': reconcileFixtures.previousDeploymentId,
            'circleId': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60'
          }
        }
      }
    ]
    expect(concat).toEqual(expected)
  })
})
