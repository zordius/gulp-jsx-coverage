var React = require('react');
module.exports = React.createClass({
    displayName: 'TestComponent',
    notUsed: function () {
        return 1 + 3;
    },
    render: function () {
        return <div>Hello World</div>;
    } 
});
