var React = require('react');
var ReactDOM = require('react-dom');
var numeral = require("numeral");

var InputRange = React.createClass({
  componentDidMount: function() {
  },
  handleRangeChange: function(event) {
      this.setState({
          value: event.target.value,
      });
  },
  render: function() {
    var indent = {"paddingLeft": "20px"};
    return (
            <div>
                <input 
                    type="range" 
                    min="0" 
                    max="20000000" 
                    value={this.props.value} 
                    onChange={this.props.onRangeChanged}/>

            </div>
    );
  }
});

exports = module.exports = InputRange;
