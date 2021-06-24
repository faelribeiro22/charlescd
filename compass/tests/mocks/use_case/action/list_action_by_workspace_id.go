// Code generated by mockery v0.0.0-dev. DO NOT EDIT.

package action

import (
	domain "github.com/ZupIT/charlescd/compass/internal/domain"
	mock "github.com/stretchr/testify/mock"

	uuid "github.com/google/uuid"
)

// ListAction is an autogenerated mock type for the ListAction type
type ListAction struct {
	mock.Mock
}

// Execute provides a mock function with given fields: workspaceId
func (_m *ListAction) Execute(workspaceId uuid.UUID) ([]domain.Action, error) {
	ret := _m.Called(workspaceId)

	var r0 []domain.Action
	if rf, ok := ret.Get(0).(func(uuid.UUID) []domain.Action); ok {
		r0 = rf(workspaceId)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).([]domain.Action)
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
