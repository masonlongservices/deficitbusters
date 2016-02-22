var React = require('react');
var ReactDOM = require('react-dom');
var _ = require("lodash");
var numeral = require("numeral");
var DetailSummary = require("./DetailSummary");

var AccountList = React.createClass({
  render: function() {
    var orderedBudgetItems = _.orderBy(this.props.budgetItems, ["amount"], ["desc"]);
    return (
            <div>
                {_.map(orderedBudgetItems, function(itemProps, item) {
                    return <div>{itemProps["account"]} ({numeral(itemProps["amount"]).format('$0,0')})</div>
                })}
            </div>
    );
  }
});

exports = module.exports = AccountList;
