mocha = require 'mocha'
assert = require 'assert'
Component = require './Component.cjsx'
testlib = require './testlib'
ReactDOM = require 'react-dom'

mocha.describe 'Component.cjsx (tested by test7.cjsx)', ->
    mocha.it 'should render Hello World', ->
        node = testlib.renderComponent(Component)
        assert.equal('Hello World', ReactDOM.findDOMNode(node).innerHTML)
