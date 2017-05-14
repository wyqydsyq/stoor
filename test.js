/* eslint-env jest */
'use strict'

import Stoor from './src/'

test('should export', () => {
  expect(Stoor).toBeDefined()
})

test('should create new instance', () => {
  expect(new Stoor()).toBeInstanceOf(Stoor)
})

test('should set/get value', () => {
  const foo = new Stoor()
  expect(foo.set('foo', {})).toBeTruthy()
  expect(foo.set('bar', 'hello')).toBeTruthy()
  expect(foo.set('baz', 5)).toBeTruthy()
  expect(foo.get('foo')).toMatchObject({})
  expect(foo.get('bar')).toBe('hello')
  expect(foo.get('baz')).toBe(5)
})
