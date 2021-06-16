/*
 *
 *  Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

package handlers

import (
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
	metricInteractor "github.com/ZupIT/charlescd/compass/internal/use_case/metric"
	"github.com/ZupIT/charlescd/compass/web/api/handlers/representation"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"net/http"
)

func CreateMetric(createMetric metricInteractor.CreateMetric) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {

		ctx := echoCtx.Request().Context()
		var metric representation.MetricRequest

		bindErr := echoCtx.Bind(&metric)
		if bindErr != nil {
			logging.LogErrorFromCtx(ctx, bindErr)
			return echoCtx.JSON(http.StatusInternalServerError, logging.NewError("Can't parse body", bindErr, nil))
		}

		metricgroupId, parseErr := uuid.Parse(echoCtx.Param("metricGroupID"))
		if parseErr != nil {
			return echoCtx.JSON(http.StatusInternalServerError, parseErr)
		}

		list, err := createMetric.Execute(metric.MetricRequestToDomain(metricgroupId))
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusCreated, list)
	}
}

func UpdateMetric(metricMain repository.MetricRepository) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		metricId := echoCtx.Param("metricID")
		metricGroupId := echoCtx.Param("metricGroupID")

		newMetric, err := metricMain.ParseMetric(echoCtx.Request().Body)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		if err := metricMain.Validate(newMetric); len(err.GetErrors()) > 0 {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		newMetric.ID = uuid.MustParse(metricId)
		newMetric.MetricsGroupID = uuid.MustParse(metricGroupId)

		updateMetric, err := metricMain.UpdateMetric(newMetric)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusOK, updateMetric)
	}
}

func DeleteMetric(metricMain repository.MetricRepository) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		metricId := echoCtx.Param("metricID")

		err := metricMain.RemoveMetric(metricId)
		if err != nil {
			return echoCtx.JSON(http.StatusInternalServerError, err)
		}

		return echoCtx.JSON(http.StatusNoContent, nil)
	}
}
