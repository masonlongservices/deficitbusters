// main.js
var React = require('react');
var ReactDOM = require('react-dom');

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

var HelloMessage = React.createClass({
    getInitialState: function() {
        return { deficitAmount: 19032777056146.24 };
    },
    componentDidMount: function(){
        //setInterval(this.tick, 2000);
    },
    tick: function() {
        this.setState({deficitAmount: this.state.deficitAmount + 54000.78});
    },
    render: function() {
        var deficitAmount = this.state.deficitAmount;
        return (
                <div>
                    <div>Hello {this.props.name}</div>
                    <OdometerComponent value={deficitAmount} />
                </div>
               )
    }
});

ReactDOM.render(
  <HelloMessage />,
  document.getElementById('container')
);
