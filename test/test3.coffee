mocha = require 'mocha'
mocha.describe 'test3.coffee test', ->
  mocha.it 'should pass', ->
    hello = 1
    notCover = 2 if (0)
  mocha.it.skip 'should not cover', ->
    hello = 3
