// Code generated by mockery v0.0.0-dev. DO NOT EDIT.

package metrics_group

import (
	domain "github.com/ZupIT/charlescd/compass/internal/domain"

	mock "github.com/stretchr/testify/mock"

	uuid "github.com/google/uuid"
)

// FindAllMetricsGroup is an autogenerated mock type for the FindAllMetricsGroup type
type FindAllMetricsGroup struct {
	mock.Mock
}

// Execute provides a mock function with given fields: workspaceId
func (_m *FindAllMetricsGroup) Execute(workspaceId uuid.UUID) ([]domain.MetricsGroup, error) {
	ret := _m.Called(workspaceId)

	var r0 []domain.MetricsGroup
	if rf, ok := ret.Get(0).(func(uuid.UUID) []domain.MetricsGroup); ok {
		r0 = rf(workspaceId)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).([]domain.MetricsGroup)
		}
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(uuid.UUID) error); ok {
		r1 = rf(workspaceId)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}
