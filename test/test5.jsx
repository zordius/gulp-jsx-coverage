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

        assert.equal('Ya!', node.getDOMNode().querySelector('span').innerHTML);
        assert.equal('6', node.getDOMNode().querySelector('div').innerHTML);
    });

    it.skip('should not show coverage info for test2.jsx', function () {
        console.log('test2.jsx is not included in coverage report');
    });
});
