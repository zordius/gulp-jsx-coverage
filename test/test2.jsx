'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var assert = require('assert');
var target = require('./target');
var Component = require('./Component.jsx');
var Testlib = require('./testlib');

describe('target (tested by test2.jsx)', function () {
    it('should multiply correctly', function () {
        var node = Testlib.renderJSX(<div>
         <h3>Test...</h3>
         <span>Ya!</span>
         <div>{target.multi(3,2)}</div>
         <pre>{`
This is multi
line string!
`}</pre>
        </div>);

        assert.equal('Ya!', ReactDOM.findDOMNode(node).querySelector('span').innerHTML);
        assert.equal('6', ReactDOM.findDOMNode(node).querySelector('div').innerHTML);
    });

    it.skip('should not show coverage info for test2.jsx', function () {
        console.log('test2.jsx is not included in coverage report');
    });

    it('should exception and failed', function () {
        `hohoho
 this is
 multi line
 error!`.notAFunction();
    });

});

describe('Component.jsx (tested by test2.jsx)', function () {
    it('should render Hello World', function() {
        var node = Testlib.renderComponent(Component);
        assert.equal('Hello World', ReactDOM.findDOMNode(node).innerHTML);
    });
});
