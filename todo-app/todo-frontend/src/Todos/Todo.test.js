import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Todo from './Todo'

test('renders content', () => {
  const todo = { text: 'Test text', done: false }

  render(<Todo {...{todo, onClickDelete: () => {}, onClickComplete: () => {}}} />)

  expect(screen.getByText('Test text')).toBeDefined()
  expect(screen.getByText('This todo is not done')).toBeDefined()
})