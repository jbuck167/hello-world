import React, { Component } from "react";
import "./SimHeader.css";
import CurrentTimeForm from "./CurrentTimeBox";

import Toggle from "./Toggle";
// import SchedulerManager from "../implementation/SchedulerManager";

class SimHeader extends Component {
    constructor(props) {
        super(props);

        this.Run100 = this.Run100.bind(this);
        this.Run1 = this.Run1.bind(this);
        this.TimeChanged = this.TimeChanged.bind(this);
    }

    GetSemaphoreToggleState() {
        return this.SemaphoreToggle.GetToggleState();
    }

    Run1() {
        this.props.Run(1);
    }

    Run100() {
        this.props.Run(100);
    }

    TimeChanged(time) {
        this.props.UpdateManger(time);
    }

    ChangeTime(time) {
        this.TimeForm.UpdateTime(time);
    }

    render() {
        return (
            <div className="SimHeader header-container">
              <div className="column-header column-one"> 
                <Toggle className={'resize'} 
                    ref = {c => this.SemaphoreToggle = c}
                    on={'Hide Semaphore Queues'} 
                    off={'Show Semaphore Queues'}/>
              </div>
              <div className="column-header column-two"> 
                <CurrentTimeForm ref={c => this.TimeForm = c }
                time={this.props.Time} onChange={this.TimeChanged}/>
                {/* {this.manager.CurrentTime} */}
              </div>
              <div className="column-header column-three">
                <button onClick={this.Run1}>
                  Run 1
                </button>
              </div>
              <div className="column-header column-four">
                <button onClick={this.Run100}>
                  Run 100
                </button>
              </div>
            </div>
        );
    }
}

export default SimHeader;