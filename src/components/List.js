var React = require('react');
var ReactDOM = require('react-dom');
var _ = require("lodash");
var numeral = require("numeral");
var DetailSummary = require("./DetailSummary");
var ListItem = require("./ListItem");

var List = React.createClass({
  render: function() {
    var orderedItems = _.orderBy(this.props.items, ["amount"], ["desc"]);
    var summaryText = {
        width: "50%",
        float: "left"
    };
    return (
            <div>
                {_.map(orderedItems, function(item) {
                    return (
                            <ListItem 
                                title={item.name + " (" + numeral(item.amount).format('$0,0') + ")"}
                                value={item.amount}
                                key={item.name}
                                />
                           )
                })}
            </div>
    )
  }
});

exports = module.exports = List;
