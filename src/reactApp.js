var React = require('react');
var ReactDOM = require('react-dom');
var Papa = require("papaparse");
var _ = require("lodash");
var numeral = require("numeral");
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
            budget: [],
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
    onRangeChanged: function(event) {
        console.log("onRangeChanged");
        console.log(event);
        console.log(event.target.value);
        console.log(event.target);
    },
    onAgencyAmountChanged: function(agency, event) {
      console.log("onAgencyAmountChanged");
      console.log(event);
      var budget = this.state.budget;
      budget[agency]["amount"] = event.target.value;
      console.log(agency);
      console.log(budget[agency]);
      this.setState({budget: budget});
    },
    tick: function() {
        this.setState({deficitAmount: this.state.deficitAmount + 54000.78});
    },
    render: function() {
        var deficitAmount = this.state.deficitAmount;
        var indent = {"paddingLeft": "20px"};
        var summaryText = {
            width: "50%",
            float: "left"
        };
        var orderedAgencyList = _.orderBy(this.state.budget, ["amount"], ["desc"]);
        var self = this;
        return (
                <div>
                  {_.map(orderedAgencyList, function(agencyProps, agency) {
                    var agencyName = agencyProps["name"];
                    var agencyAmount = numeral(agencyProps["amount"]).format('$0,0');
                    return (
                        <details>
                          <summary>
                            <div style={summaryText}>{agencyName + " (" + agencyAmount + ")"}</div>
                            <input 
                                agency={agencyName}
                                type="range" 
                                min="0" 
                                max="20000000" 
                                value={self.state.budget[agencyName]["amount"]}
                                onChange={self.onAgencyAmountChanged.bind(self, agencyName)} />
                          </summary>
                          <div style={indent}>
                            {_.map(_.orderBy(agencyProps["items"], ["amount"], ["desc"]), function(bureauProps, bureau) {
                              var bureauName = bureauProps["name"];
                              var bureauAmount = numeral(bureauProps["amount"]).format('$0,0');
                              return (
                                <details>
                                  <summary>
                                    <div style={summaryText}>{bureauName + " (" + bureauAmount + ")"}</div>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="20000000" 
                                        value={bureauProps["amount"]} 
                                        onChange={self.onRangeChanged} />
                                  </summary>
                                  <div style={indent}>
                                    {_.map(_.orderBy(bureauProps["items"], ["amount"], ["desc"]), function(accountProps, account) {
                                      var accountName = accountProps["name"];
                                      var accountAmount = numeral(accountProps["amount"]).format('$0,0');
                                      return (
                                        <div>
                                          <div style={summaryText}>{accountName + " (" + accountAmount + ")"}</div>
                                          <input 
                                              type="range" 
                                              min="0" 
                                              max="20000000" 
                                              value={accountProps["amount"]} 
                                              onChange={self.onRangeChanged} />
                                        </div>
                                        )
                                    })}
                                  </div>
                                </details>
                                )
                              
                            })}
                          </div>
                        </details>
                    )
                  })}

                  <OdometerComponent value={deficitAmount} />
                </div>
               )
    }
});

ReactDOM.render(
  <DeficitBusters />,
  document.getElementById('container')
);
