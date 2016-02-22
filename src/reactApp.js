var React = require('react');
var ReactDOM = require('react-dom');
var Papa = require("papaparse");
var _ = require("lodash");
var numeral = require("numeral");
var AgencyList = require("./components/AgencyList");
var DetailSummaryList = require("./components/DetailSummaryList");
var List = require("./components/List");

var OdometerComponent = React.createClass({
  componentDidMount: function(){
     this.odometer = new Odometer({
      el: ReactDOM.findDOMNode(this),
      value: this.props.value
    });
  },
  componentDidUpdate: function() {
   this.odometer.update(this.props.value)
  },
  render: function() {
    return React.DOM.div()
  }
})

var OdometerEl = React.createElement(OdometerComponent);

var DeficitBusters = React.createClass({
    getInitialState: function() {
        return {
            value: 20,
            deficitAmount: 19032777056146.24,
            budgetItems: [],
        };
    },
    componentDidMount: function(){
        var self = this;
        Papa.parse("http://0.0.0.0:8001/build/budget2016.csv", {
			download: true,
            header: true,
			complete: function(results) {
                var budgetItems = results.data;

                var budget = {};

                _(budgetItems).forEach(function(item) {
                    if ("Agency Name" in item) {
                        var agency = item["Agency Name"];
                        var bureau = item["Bureau Name"];
                        var account = item["Account Name"];
                        var amount = parseInt(item["2016"].replace(",", ""));
                        if (amount != 0) {
                            if (!(agency in budget)) { budget[agency] = {name: agency, amount: 0, items:{} } }
                            if (!(bureau in budget[agency]["items"])) { budget[agency]["items"][bureau] = {name: bureau, amount: 0, items:{} } }
                            budget[agency]["items"][bureau]["items"][account] = {name: account, amount: amount};
                            budget[agency]["amount"] += amount;
                            budget[agency]["items"][bureau]["amount"] += amount;
                        }
                    }
                });

				console.log(budget);
                self.setState({budget: budget});
			}
		});
        //setInterval(this.tick, 2000);
    },
    tick: function() {
        this.setState({deficitAmount: this.state.deficitAmount + 54000.78});
    },
    render: function() {
        var deficitAmount = this.state.deficitAmount;
        var indent = {"paddingLeft": "20px"};
        var orderedAgencyList = _.orderBy(this.state.budget, ["amount"], ["desc"]);
        return (
                <div>
                    <DetailSummaryList items={orderedAgencyList} >
                        <DetailSummaryList >
                            <List />
                        </DetailSummaryList>
                    </DetailSummaryList>

                    <OdometerComponent value={deficitAmount} />
                </div>
               )
    }
});

ReactDOM.render(
  <DeficitBusters />,
  document.getElementById('container')
);
