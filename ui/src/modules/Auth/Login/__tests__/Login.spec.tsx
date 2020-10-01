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
import { render, screen, act, wait, fireEvent } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import Login from '..';
import routes from 'core/constants/routes';
import { FetchMock } from 'jest-fetch-mock';

const originalWindow = window;
beforeEach(() => {
  Object.assign(window, originalWindow);
  const location = window.location
  delete global.window.location
  global.window.location = Object.assign({}, location)
})

test('render Login page', () => {
  render(<Login />);

  const iconCharles = screen.queryByTestId('icon-charles-logo');
  const inputEmail = screen.queryByTestId('input-email-email');
  const inputPassword = screen.queryByTestId('input-password-password');
  const buttonSubmit = screen.queryByTestId('button-default-submit');
  expect(iconCharles).toBeInTheDocument();
  expect(inputEmail).toBeInTheDocument();
  expect(inputPassword).toBeInTheDocument();
  expect(buttonSubmit).toBeInTheDocument();
  expect(buttonSubmit).toBeDisabled();
});

test.only('render Login page', async () => {
  window.location = {
    ...window.location,
    href: '',
    pathname: '/workspaces',
  };

  render(<Login />);

  (fetch as FetchMock).mockResponseOnce(JSON.stringify({
    access_token: 'abcdefghijklmn', refresh_token: 'opqrstuvwxyz'
  }));
  
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({
    circles: [{ id: '123', name: 'circle' }]
  }));
  
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({
    id: '1',
    name: 'charlescd',
    email: 'charlescd@zup.com.br',
    workspaces: [{ id: '1', name: 'workspace' }]
  }));

  const inputEmail = screen.queryByTestId('input-email-email');
  const inputPassword = screen.queryByTestId('input-password-password');
  const buttonSubmit = screen.queryByTestId('button-default-submit');
  
  await act(async () => userEvent.type(inputEmail, 'charlescd@zup.com.br'));
  await act(async () => userEvent.type(inputPassword, '123mudar'));

  expect(buttonSubmit).not.toBeDisabled();

  fireEvent.click(buttonSubmit);

  await wait();

  expect(window.location.href).toEqual(routes.workspaces);
});
