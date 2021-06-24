// Code generated by mockery v0.0.0-dev. DO NOT EDIT.

package metrics_group_action

import (
	domain "github.com/ZupIT/charlescd/compass/internal/domain"

	mock "github.com/stretchr/testify/mock"

	uuid "github.com/google/uuid"
)

// CreateMetricGroupAction is an autogenerated mock type for the CreateMetricGroupAction type
type CreateMetricGroupAction struct {
	mock.Mock
}

// Execute provides a mock function with given fields: metricsGroupAction, workspaceId
func (_m *CreateMetricGroupAction) Execute(metricsGroupAction domain.MetricsGroupAction, workspaceId uuid.UUID) (domain.MetricsGroupAction, error) {
	ret := _m.Called(metricsGroupAction, workspaceId)

	var r0 domain.MetricsGroupAction
	if rf, ok := ret.Get(0).(func(domain.MetricsGroupAction, uuid.UUID) domain.MetricsGroupAction); ok {
		r0 = rf(metricsGroupAction, workspaceId)
	} else {
		r0 = ret.Get(0).(domain.MetricsGroupAction)
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(domain.MetricsGroupAction, uuid.UUID) error); ok {
		r1 = rf(metricsGroupAction, workspaceId)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}
