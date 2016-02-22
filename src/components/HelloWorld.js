var React = require('react');
var ReactDOM = require('react-dom');

var HelloWorld = React.createClass({
  render: function() {
    return (
      <div>
        Hello, world! I am a HelloWorld.
      </div>
    );
  }
});

exports = module.exports = HelloWorld;
