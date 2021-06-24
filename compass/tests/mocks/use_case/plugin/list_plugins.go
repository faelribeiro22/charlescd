// Code generated by mockery v0.0.0-dev. DO NOT EDIT.

package plugin

import (
	domain "github.com/ZupIT/charlescd/compass/internal/domain"
	mock "github.com/stretchr/testify/mock"
)

// ListPlugins is an autogenerated mock type for the ListPlugins type
type ListPlugins struct {
	mock.Mock
}

// Execute provides a mock function with given fields: category
func (_m *ListPlugins) Execute(category string) ([]domain.Plugin, error) {
	ret := _m.Called(category)

	var r0 []domain.Plugin
	if rf, ok := ret.Get(0).(func(string) []domain.Plugin); ok {
		r0 = rf(category)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).([]domain.Plugin)
		}
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(string) error); ok {
		r1 = rf(category)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}
