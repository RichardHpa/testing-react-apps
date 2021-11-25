// form testing
// http://localhost:3000/login

import * as React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from '../../components/login'
import faker from 'faker'
import {build, fake} from '@jackfranklin/test-data-bot'

const buildLoginForm = build({
  fields: {
    username: fake(faker => faker.internet.userName()),
    password: fake(faker => faker.internet.password()),
  },
})

// const buildLoginForm = overrides => {
//   return {
//     username: faker.internet.userName(),
//     password: faker.internet.password(),
//     ...overrides,
//   }
// }

test('submitting the form calls onSubmit with username and password', () => {
  const {username, password} = buildLoginForm()
  // let submittedData = {}
  // const handleSubmit = data => (submittedData = data)
  const handleSubmit = jest.fn()
  render(<Login onSubmit={handleSubmit} />)
  // const username = 'Jimmy'
  // const password = '12345'

  userEvent.type(screen.getByLabelText(/username/i), username)
  userEvent.type(screen.getByLabelText(/password/i), password)
  userEvent.click(screen.getByRole('button', {name: /submit/i}))
  // expect(submittedData).toEqual({
  //   username,
  //   password,
  // })
  expect(handleSubmit).toHaveBeenCalledWith({username, password})
  expect(handleSubmit).toHaveBeenCalledTimes(1)
})

/*
eslint
  no-unused-vars: "off",
*/
