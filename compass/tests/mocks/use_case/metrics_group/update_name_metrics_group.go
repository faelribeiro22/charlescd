// Code generated by mockery v0.0.0-dev. DO NOT EDIT.

package metrics_group

import (
	domain "github.com/ZupIT/charlescd/compass/internal/domain"

	mock "github.com/stretchr/testify/mock"

	uuid "github.com/google/uuid"
)

// UpdateNameMetricsGroup is an autogenerated mock type for the UpdateNameMetricsGroup type
type UpdateNameMetricsGroup struct {
	mock.Mock
}

// Execute provides a mock function with given fields: id, metricsGroup
func (_m *UpdateNameMetricsGroup) Execute(id uuid.UUID, metricsGroup domain.MetricsGroup) (domain.MetricsGroup, error) {
	ret := _m.Called(id, metricsGroup)

	var r0 domain.MetricsGroup
	if rf, ok := ret.Get(0).(func(uuid.UUID, domain.MetricsGroup) domain.MetricsGroup); ok {
		r0 = rf(id, metricsGroup)
	} else {
		r0 = ret.Get(0).(domain.MetricsGroup)
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(uuid.UUID, domain.MetricsGroup) error); ok {
		r1 = rf(id, metricsGroup)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}
