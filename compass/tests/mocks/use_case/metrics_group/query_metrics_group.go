// Code generated by mockery v0.0.0-dev. DO NOT EDIT.

package metrics_group

import (
	domain "github.com/ZupIT/charlescd/compass/internal/domain"

	mock "github.com/stretchr/testify/mock"

	uuid "github.com/google/uuid"
)

// QueryMetricsGroup is an autogenerated mock type for the QueryMetricsGroup type
type QueryMetricsGroup struct {
	mock.Mock
}

// Execute provides a mock function with given fields: id, periodParameter, intervalParameter
func (_m *QueryMetricsGroup) Execute(id uuid.UUID, periodParameter string, intervalParameter string) ([]domain.MetricValues, error) {
	ret := _m.Called(id, periodParameter, intervalParameter)

	var r0 []domain.MetricValues
	if rf, ok := ret.Get(0).(func(uuid.UUID, string, string) []domain.MetricValues); ok {
		r0 = rf(id, periodParameter, intervalParameter)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).([]domain.MetricValues)
		}
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(uuid.UUID, string, string) error); ok {
		r1 = rf(id, periodParameter, intervalParameter)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}
