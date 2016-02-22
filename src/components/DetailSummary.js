var React = require('react');
var ReactDOM = require('react-dom');
var ListItem = require("./ListItem");

var DetailSummary = React.createClass({
  componentDidMount: function() {
  },
  render: function() {
    var indent = {"paddingLeft": "20px"};
    return (
            <details>
                <summary>
                    <ListItem 
                        title={this.props.summary}
                        value={this.props.value}
                        onRangeChanged={this.props.onRangeChanged}
                        />
                </summary>
                <div style={indent}>{this.props.children}</div>
            </details>
    );
  }
});

exports = module.exports = DetailSummary;
