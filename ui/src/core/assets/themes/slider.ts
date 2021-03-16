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

import {
  COLOR_BASTILLE,
  COLOR_SANTAS_GREY,
  COLOR_WHITE
} from 'core/assets/colors';

export const light = {};

export const dark = {
  backgroundColor: COLOR_BASTILLE,
  thumbColor: COLOR_WHITE,
  valueBorderColor: COLOR_WHITE,
  valueColor: {
    active: COLOR_WHITE,
    inactive: COLOR_SANTAS_GREY
  }
};