var React = require('react');
var ReactDOM = require('react-dom');
var _ = require("lodash");
var numeral = require("numeral");
var DetailSummary = require("./DetailSummary");
var AccountList = require("./AccountList.js");

var BureauList = React.createClass({
  render: function() {
    var orderedBudgetItems = _.orderBy(this.props.budgetItems, ["totalAmount"], ["desc"]);
    return (
            <div>
                {_.map(orderedBudgetItems, function(itemProps, item) {
                    var name = itemProps["bureau"];
                    var totalAmount = numeral(itemProps["totalAmount"]).format('$0,0');
                    return (
                            <DetailSummary summary={name + " (" + totalAmount + ")"}>
                                <AccountList budgetItems={itemProps["accounts"]} />
                            </DetailSummary>
                           )
                })}
            </div>
    );
  }
});

exports = module.exports = BureauList;
