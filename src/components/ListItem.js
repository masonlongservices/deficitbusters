var React = require('react');
var ReactDOM = require('react-dom');
var _ = require("lodash");
var numeral = require("numeral");
var DetailSummary = require("./DetailSummary");
var InputRange = require("./InputRange");

var ListItem = React.createClass({
  render: function() {
    var summaryText = {
        width: "50%",
        float: "left"
    };
    return (
            <div>
                <div style={summaryText}>{this.props.title}</div>
                <InputRange value={this.props.value} />
            </div>
    )
  }
});

exports = module.exports = ListItem;
