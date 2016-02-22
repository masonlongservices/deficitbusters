var React = require('react');
var ReactDOM = require('react-dom');
var _ = require("lodash");
var numeral = require("numeral");
var DetailSummary = require("./DetailSummary");

var DetailSummaryList = React.createClass({
  render: function() {
    console.log("render");
    var self = this;
    var orderedItems = _.orderBy(this.props.items, ["amount"], ["desc"]);
    return (
            <div>
                {_.map(orderedItems, function(itemProps, item) {
                    var name = itemProps["name"];
                    var amount = numeral(itemProps["amount"]).format('$0,0');
                    return (
                            <DetailSummary summary={name + " (" + amount + ")"} value={itemProps["amount"]} key={name}>
                                {React.Children.map(self.props.children, function (child) {
                                    return React.cloneElement(child, {
                                        items: itemProps["items"]
                                    })
                                })}
                            </DetailSummary>
                           )
                })}
            </div>
    );
  }
});

exports = module.exports = DetailSummaryList;
