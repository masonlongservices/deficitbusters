// main.js
var React = require('react');
var ReactDOM = require('react-dom');
var Papa = require("papaparse");
var _ = require("lodash");

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
                    var agency = item["Agency Name"];
                    var bureau = item["Bureau Name"];
                    var account = item["Account Name"];
                    var amount = item["2016"];
                    if (!(agency in budget)) { budget[agency] = {} }
                    if (!(bureau in budget[agency])) { budget[agency][bureau] = {} }
                    budget[agency][bureau][account] = amount;
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
        return (
                <div>
                    {_.forEach(this.state.budget, function(agency, bureauData) {
                        return (
                            <details>
                                <summary>{agency}</summary>
                                {_.forEach(bureauData, function(bureau, accountData) {
                                    return (
                                        <details>
                                            <summary>{bureau}</summary>
                                        </details>
                                    )
                                })}
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
