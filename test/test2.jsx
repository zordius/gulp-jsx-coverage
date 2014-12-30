'use strict';

var jsdom = require('jsdom').jsdom,
    React = require('react'),
    TestUtils = require('react/addons').addons.TestUtils,
    assert = require('assert'),
    target = require('./target'),

Testlib = {
    renderJSX: function (jsx, context) {
        return Testlib.renderComponent(React.createClass({
            displayName: 'TestJSX',
            render: function () {return jsx;}
        }), undefined, context);
    },
    renderComponent: function (react, props, context) {
        var rendered;
        global.document = jsdom('<!DOCTYPE html><html><body></body></html>');
        global.window = document.parentWindow;
        rendered = TestUtils.renderIntoDocument(React.createElement(react, props));
        return TestUtils.findRenderedComponentWithType(rendered, react);
    }
};

describe('test coverage', function () {
    it('should covered', function (done) {
        var node = Testlib.renderJSX(<div>{target.multi(3,2)}</div>);

        assert.equal('6', node.getDOMNode().innerHTML);
        done();
    });
});
