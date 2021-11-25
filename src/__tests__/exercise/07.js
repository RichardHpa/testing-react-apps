// testing with context and a custom render method
// http://localhost:3000/easy-button

import * as React from 'react'
import {render, screen} from '@testing-library/react'
import {ThemeProvider} from '../../components/theme'
import EasyButton from '../../components/easy-button'

function renderWithTheme(ui, {theme = 'light', ...options} = {}) {
  const Wrapper = ({children}) => (
    <ThemeProvider initialTheme={theme}>{children}</ThemeProvider>
  )

  return render(ui, {wrapper: Wrapper, ...options})
}

test('renders with the light styles for the light theme', () => {
  // const Wrapper = ({children}) => (
  //   <ThemeProvider initialTheme="light">{children}</ThemeProvider>
  // )

  // render(<EasyButton>Easy</EasyButton>, {wrapper: Wrapper})
  // renderWithTheme(<EasyButton>Easy</EasyButton>, 'light')
  renderWithTheme(<EasyButton>Easy</EasyButton>)
  const button = screen.getByRole('button', {name: /easy/i})
  expect(button).toHaveStyle(`
    background-color: white;
    color: black;
  `)
})

test('renders with dark styles for the dark theme', () => {
  // const Wrapper = ({children}) => (
  //   <ThemeProvider initialTheme="dark">{children}</ThemeProvider>
  // )

  // render(<EasyButton>Easy</EasyButton>, {wrapper: Wrapper})
  // renderWithTheme(<EasyButton>Easy</EasyButton>, 'dark')
  renderWithTheme(<EasyButton>Easy</EasyButton>, {theme: 'dark'})
  const button = screen.getByRole('button', {name: /easy/i})
  expect(button).toHaveStyle(`
    background-color: black;
    color: white;
  `)
})

/* eslint no-unused-vars:0 */
