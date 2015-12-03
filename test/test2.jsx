'use strict';

var jsdom = require('jsdom').jsdom;
var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var assert = require('assert');
var target = require('./target');
var Component = require('./Component.jsx');

var Testlib = {
    renderJSX: function (jsx, context) {
        return Testlib.renderComponent(React.createClass({
            displayName: 'TestJSX',
            render: function () {return jsx;}
        }), undefined, context);
    },
    renderComponent: function (react, props, context) {
        var rendered;
        global.document = jsdom('<!DOCTYPE html><html><body></body></html>');
        global.window = global.document.parentWindow;
        rendered = TestUtils.renderIntoDocument(React.createElement(react, props));
        return TestUtils.findRenderedComponentWithType(rendered, react);
    }
};

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
