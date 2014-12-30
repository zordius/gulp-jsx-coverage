assert = require 'assert'
target = require './target'
desribe 'Coffee test', ->
    it 'should cover well', ->
        `assert.equal(15, target.multi(3, 5))`
