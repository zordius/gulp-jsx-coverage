mocha = require 'mocha'
mocha.describe 'Coffee test', ->
  mocha.it 'should pass', ->
    hello = 1
    notCover = 2 if (0)
