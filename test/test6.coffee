assert = require 'assert'
target = require './target'

describe 'target (tested by test3.coffee)', ->
  it 'should multiply correctly', ->
    assert.equal(9, target.multi(3, 3))
    assert.equal(6, target.multi(3, 2))
  xit 'should not show coverage info for test3.coffee', ->
    console.log 'test3.coffee is not included in coverage report'
