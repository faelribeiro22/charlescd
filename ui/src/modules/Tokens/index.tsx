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

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from 'containers/PrivateRoute';
import Page from 'core/components/Page';
import routes from 'core/constants/routes';
import Menu from './Menu';

const Placeholder = React.lazy(() => import('./Placeholder'));
const Comparation = React.lazy(() => import('./Comparation'));

const Tokens = () => (
  <Page>
    <Page.Menu>
      <Menu />
    </Page.Menu>
    <Page.Content>
      <React.Suspense fallback="">
        <Switch>
          <PrivateRoute
            allowedRoles={['modules_read', 'modules_write']}
            path={routes.tokensComparation}
            component={Comparation}
          />
          <Route path={routes.tokens} component={Placeholder} />
        </Switch>
      </React.Suspense>
    </Page.Content>
  </Page>
);

export default Tokens;
