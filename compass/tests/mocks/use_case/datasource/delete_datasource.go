// Code generated by mockery v0.0.0-dev. DO NOT EDIT.

package datasource

import (
	uuid "github.com/google/uuid"
	mock "github.com/stretchr/testify/mock"
)

// DeleteDatasource is an autogenerated mock type for the DeleteDatasource type
type DeleteDatasource struct {
	mock.Mock
}

// Execute provides a mock function with given fields: id
func (_m *DeleteDatasource) Execute(id uuid.UUID) error {
	ret := _m.Called(id)

	var r0 error
	if rf, ok := ret.Get(0).(func(uuid.UUID) error); ok {
		r0 = rf(id)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}
