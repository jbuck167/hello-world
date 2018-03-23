import React, { Component } from "react";

class CurrentTimeForm extends Component {
    constructor(props) {
      super(props);
      this.state = {value: props.time};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);

      this.UpdateTime = this.UpdateTime.bind(this);
    }

    UpdateTime(time) {
      this.setState({value: time});
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
    //   alert('The simulator time will be set to: ' + this.state.value);
      event.preventDefault();
      this.props.onChange(this.state.value); 
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Current Time: 
            <input type="number" value={this.state.value} onChange={this.handleChange} />
          </label>
          
          {/* <input type="submit" value="Go" /> */}
        </form>
      );
    }
  }

  export default CurrentTimeForm;