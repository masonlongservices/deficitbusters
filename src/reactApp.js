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
            agencies: [],
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

                var agencies = [];
                _(budgetItems).forEach(function(item) {
                    if ("Agency Name" in item) {
                        var agencyName = item["Agency Name"];
                        var bureauName = item["Bureau Name"];
                        var accountName = item["Account Name"];
                        var amount = parseInt(item["2016"].replace(",", ""));
                        if (amount != 0) {
                            var agency = _.remove(agencies, (agency) => agency.name === agencyName)[0];
                            if (agency === undefined) {
                                agency = {"name": agencyName, amount: 0, bureaus: []};
                            }

                            var bureau = _.remove(agency.bureaus, (bureau) => bureau.name === bureauName)[0];
                            if (bureau === undefined) {
                                bureau = {"name": bureauName, amount: 0, accounts: []};
                            }

                            bureau.accounts.push({"name": accountName, "amount": amount});
                            agency.bureaus.push(bureau);
                            agencies.push(agency);
                        }
                    }
                });

                self.setState({agencies: agencies});
                self.calculateSums();
                self.reorderByAmounts();
			}
		});
        //setInterval(this.tick, 2000);
    },
    calculateSums: function() {
        var agencies = this.state.agencies;
        for (var agency of agencies) {
            for (var bureau of agency.bureaus) {
                bureau.amount = bureau.accounts.reduce( (prev, curr) => prev + curr.amount, 0 );
            }
            agency.amount = agency.bureaus.reduce( (prev, curr) => prev + curr.amount, 0 )
        }
        this.setState({agencies: agencies});
    },
    reorderByAmounts: function() {
        var agencies = this.state.agencies;
        agencies.sort( (a,b) => a.amount > b.amount ? -1 : 1 );
        for (var agency of this.state.agencies) {
            for (var bureau of agency.bureaus) {
                bureau.accounts.sort( (a,b) => a.amount > b.amount ? -1 : 1 );
            }
            agency.bureaus.sort( (a,b) => a.amount > b.amount ? -1 : 1 );
        }
        this.setState({agencies: agencies});
    },
    onRangeChanged: function(event) {
        console.log("onRangeChanged");
        console.log(event);
        console.log(event.target.value);
        console.log(event.target);
    },
    tick: function() {
        this.setState({deficitAmount: this.state.deficitAmount + 54000.78});
    },
    formatAsUsd: function(integer) {
        return numeral(integer).format('$0,0');
    },
    render: function() {
        var deficitAmount = this.state.deficitAmount;
        var indent = {"paddingLeft": "20px"};
        var summaryText = {
            width: "50%",
            float: "left"
        };
        var self = this;
        return (
                <div>
                  {this.state.agencies.map( (agency) => {
                    return (
                        <details>
                          <summary>
                            <div style={summaryText}>{agency.name + " (" + this.formatAsUsd(agency.amount) + ")"}</div>
                            <input 
                                agency={agency.name}
                                type="range" 
                                min="0" 
                                max="20000000" 
                                value={agency.amount}
                                />
                          </summary>
                          <div style={indent}>
                              {agency.bureaus.map( (bureau) => {
                                return (
                                    <details>
                                      <summary>
                                        <div style={summaryText}>{bureau.name + " (" + this.formatAsUsd(bureau.amount) + ")"}</div>
                                        <input
                                            bureau={bureau.name}
                                            type="range"
                                            min="0"
                                            max="20000000"
                                            value={bureau.amount}
                                            />
                                      </summary>
                                      <div style={indent}>
                                      {bureau.accounts.map( (account) => {
                                      return (
                                        <div>
                                          <div style={summaryText}>{account.name + " (" + this.formatAsUsd(account.amount) + ")"}</div>
                                          <input 
                                              type="range" 
                                              min="0" 
                                              max="20000000" 
                                              value={account.amount}
                                              />
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
