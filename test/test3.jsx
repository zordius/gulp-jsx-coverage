'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var assert = require('assert');
var target = require('./target');
var Component = require('./Component');
var Testlib = require('./testlib');

describe('Component.jsx (tested by test3.jsx)', function () {
    it('should render Hello World', function() {
        var node = Testlib.renderComponent(Component);
        assert.equal('Hello World', ReactDOM.findDOMNode(node).innerHTML);
    });
});
