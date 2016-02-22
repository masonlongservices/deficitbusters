var React = require('react');
var ReactDOM = require('react-dom');
var numeral = require("numeral");

var InputRange = React.createClass({
  componentDidMount: function() {
  },
  getInitialState: function() {
      return {
          value: this.props.value,
      }
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
                    value={this.state.value} 
                    onChange={this.handleRangeChange}/>

                {numeral(this.state.value).format('$0,0')}
            </div>
    );
  }
});

exports = module.exports = InputRange;
