// testing custom hooks
// http://localhost:3000/counter-hook

import * as React from 'react'
import {render, screen, act} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useCounter from '../../components/use-counter'
import {renderHook, act as actHooks} from '@testing-library/react-hooks'

const CounterExample = () => {
  const {count, increment, decrement} = useCounter()
  return (
    <div>
      <div>Current count: {count}</div>
      <button onClick={decrement}>Decrement</button>
      <button onClick={increment}>Increment</button>
    </div>
  )
}

test('exposes the count and increment/decrement functions', () => {
  render(<CounterExample />)
  const increment = screen.getByRole('button', {name: /increment/i})
  const decrement = screen.getByRole('button', {name: /decrement/i})
  expect(screen.getByText(/current count/i)).toHaveTextContent(
    'Current count: 0',
  )
  userEvent.click(increment)
  expect(screen.getByText(/current count/i)).toHaveTextContent(
    'Current count: 1',
  )
  userEvent.click(decrement)
  expect(screen.getByText(/current count/i)).toHaveTextContent(
    'Current count: 0',
  )
})

function setup(initialProps = {}) {
  const result = {}
  function TestComponent() {
    result.current = useCounter(initialProps)
    return null
  }
  render(<TestComponent />)
  return result
}

test('exposes the count and increment/decrement functions with a TestComponent', () => {
  const result = setup()
  expect(result.current.count).toBe(0)

  act(() => result.current.increment())
  expect(result.current.count).toBe(1)

  act(() => result.current.decrement())
  expect(result.current.count).toBe(0)
})

test('allows customization of the initial count', () => {
  const result = setup({initialCount: 10})
  expect(result.current.count).toBe(10)
})

test('allows customization of the step', () => {
  const result = setup({step: 10})
  expect(result.current.count).toBe(0)
  act(() => result.current.increment())
  expect(result.current.count).toBe(10)
})

describe(`with @testing-library/react-hooks`, () => {
  test('should increment counter', () => {
    const {result} = renderHook(() => useCounter())
    actHooks(() => {
      result.current.increment()
    })
    expect(result.current.count).toBe(1)
  })

  test('allows customization of the initial count', () => {
    const {result} = renderHook(useCounter, {initialProps: {initialCount: 10}})
    expect(result.current.count).toBe(10)
  })

  test('allows customization of the step', () => {
    const {result} = renderHook(useCounter, {initialProps: {step: 10}})
    expect(result.current.count).toBe(0)
    actHooks(() => result.current.increment())
    expect(result.current.count).toBe(10)
  })
})

/* eslint no-unused-vars:0 */
