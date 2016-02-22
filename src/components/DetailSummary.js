var React = require('react');
var ReactDOM = require('react-dom');

var DetailSummary = React.createClass({
  componentDidMount: function() {
    console.log("DetailSummary");
  },
  render: function() {
    var indent = {"paddingLeft": "20px"};
    return (
            <details>
                <summary>{this.props.summary}</summary>
                <div style={indent}>{this.props.children}</div>
            </details>
    );
  }
});

exports = module.exports = DetailSummary;
