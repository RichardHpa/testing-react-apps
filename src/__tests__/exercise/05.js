// mocking HTTP requests
// http://localhost:3000/login-submission

import * as React from 'react'
// 🐨 you'll need to grab waitForElementToBeRemoved from '@testing-library/react'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {build, fake} from '@jackfranklin/test-data-bot'
// 🐨 you'll need to import rest from 'msw' and setupServer from msw/node
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import Login from '../../components/login-submission'
import {handlers} from '../../test/server-handlers'

const buildLoginForm = build({
  fields: {
    username: fake(f => f.internet.userName()),
    password: fake(f => f.internet.password()),
  },
})

const server = setupServer(
  // rest.post(
  //   'https://auth-provider.example.com/api/login',
  //   async (req, res, ctx) => {
  //     if (!req.body.username) {
  //       return res(ctx.status(400), ctx.json({message: 'missing username'}))
  //     }
  //     if (!req.body.password) {
  //       return res(ctx.status(400), ctx.json({message: 'missing password'}))
  //     }
  //     return res(ctx.json({username: req.body.username}))
  //   },
  // ),
  ...handlers,
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test(`logging in displays the user's username`, async () => {
  render(<Login />)
  const {username, password} = buildLoginForm()

  userEvent.type(screen.getByLabelText(/username/i), username)
  userEvent.type(screen.getByLabelText(/password/i), password)
  userEvent.click(screen.getByRole('button', {name: /submit/i}))
  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  expect(screen.getByText(username)).toBeInTheDocument()
})

test(`omitting the username results in an error`, async () => {
  render(<Login />)
  const {password} = buildLoginForm()
  userEvent.type(screen.getByLabelText(/password/i), password)
  userEvent.click(screen.getByRole('button', {name: /submit/i}))
  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  // expect(screen.getByRole('alert')).toHaveTextContent(/username required/i)
  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    `"username required"`,
  )
})

test(`omitting the password results in an error`, async () => {
  render(<Login />)
  const {username} = buildLoginForm()
  userEvent.type(screen.getByLabelText(/username/i), username)
  userEvent.click(screen.getByRole('button', {name: /submit/i}))
  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  // expect(screen.getByRole('alert')).toHaveTextContent(/password required/i)
  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    `"password required"`,
  )
})

test(`unexpected server error`, async () => {
  const testErrorMessage = 'Oh no, something bad happened'
  server.use(
    rest.post(
      'https://auth-provider.example.com/api/login',
      async (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({message: testErrorMessage}))
      },
    ),
  )
  render(<Login />)
  userEvent.click(screen.getByRole('button', {name: /submit/i}))
  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  expect(screen.getByRole('alert')).toHaveTextContent(testErrorMessage)
})
