var React = require('react');
var ReactDOM = require('react-dom');
var _ = require("lodash");
var numeral = require("numeral");
var DetailSummary = require("./DetailSummary");
var BureauList = require("./BureauList");

var AgencyList = React.createClass({
  render: function() {
    console.log("AgencyList");
    var orderedBudgetItems = _.orderBy(this.props.budgetItems, ["totalAmount"], ["desc"]);
    return (
            <div>
                {_.map(orderedBudgetItems, function(itemProps, item) {
                    var name = itemProps["agency"];
                    var totalAmount = numeral(itemProps["totalAmount"]).format('$0,0');
                    return (
                            <DetailSummary summary={name + " (" + totalAmount + ")"}>
                                <BureauList budgetItems={itemProps["bureaus"]} />
                            </DetailSummary>
                           )
                    console.log(DetailSummary);
                })}
            </div>
    );
  }
});

exports = module.exports = AgencyList;
