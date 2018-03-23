import React, { Component } from "react";
import "./Simulator.css";

import EventQueue from "./Queues/EventQueue";
import LargeJobQueue from "./Queues/LargeJobQueue";
import SmallJobQueue from "./Queues/SmallJobQueue";
import IOQueue from "./Queues/IOQueue";
import SimHeader from "./Utils/SimHeader";
//import {Rectangle, Circle, Ellipse, Line, Polyline, CornerBox, Triangle} from 'react-shapes';

import SchedulerManager from "./implementation/SchedulerManager"

  // var data = [
  //   {type: 'A', arrivalTime: 100, number: 1, memory: 20, runtime: 78},
  //   {type: 'A', arrivalTime: 120, number: 2, memory: 60, runtime: 90},
  //   {type: 'A', arrivalTime: 122, number: 3, memory: 1, runtime: 1}
  // ];

var manager = new SchedulerManager();

fetch('inputFileC.txt')
.then(response => response.text())
.then(function(result) { 
  manager.ReadText(result); 
});

class Simulator extends Component {
  constructor() {
    super();
    this.UseSempahores = true;
    this.render = this.render.bind(this);
    this.getTime = this.getTime.bind(this);
    this.state = {time: '', runfor: 0};

    this.UpdateManager = this.UpdateManager.bind(this);
    this.Run = this.Run.bind(this);
  }
  
  componentDidMount() {
      this._interval = setInterval(() => this.setState({time: this.getTime()}), 1000);
  }
  componentWillUnmount() {
    clearInterval(this._interval);
  }
  getTime(){
    let t = new Date();
    return `${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`;
  }
  componentDidUpdate() {
    this.UseSempahores = this.Header.GetSemaphoreToggleState();
    // this.Header.TimeChanged(manager.CurrentTime);
    // this.setState(
    // console.log("Updated");
    //console.log(this.Header.GetSemaphoreToggleState());
  }

  UpdateManager(time) {
    if (time>30000) {time=30000;}
    console.log("Resetting Manager");
    // console.log(manager);
    manager.Reset();
    // manager = new SchedulerManager(manager.PermEventListOBJ);
    // console.log(manager);
    manager.Run(time); 
  }

  Run(time) {
    manager.Run(time);
    this.Header.ChangeTime(manager.CurrentTime);
  }
  
  render() {
    const Semaphores = this.UseSempahores ? (
    <div>

     <div className="inner_container">  

      <div className="column-Left">   
        <div className="SmallTable">
         <h2 className="fixed"><center>Ready Queue Level 1</center></h2>
          <SmallJobQueue data={manager.ReadyQueueI}/>
        </div>
        <br/>
        <div className="SmallTable">
          <h2 className="fixed"><center>I/O Burst Queue</center></h2>
          <IOQueue data={manager.WaitQueueIO.WaitQueue}/>
        </div>
        <br/>
        <div className="SmallTable">
          <h2 className="fixed"><center>{("Semaphore 2 (Signal: " + manager.S[1] + ")")}</center></h2>
          <SmallJobQueue data={manager.WaitQueueS[1]}/>
        </div>
        <br/>
        <div className="SmallTable">
          <h2 className="fixed"><center>{("Semaphore 4 (Signal: " + manager.S[3] + ")")}</center></h2>
          <SmallJobQueue data={manager.WaitQueueS[3]}/>
        </div>
      </div>

      <div className="column-Middle"/> 

      <div className="column-Right">  
        <div className="SmallTable">
          <h2 className="fixed"><center>Ready Queue Level 2</center></h2>
          <SmallJobQueue data={manager.ReadyQueueII}/>
        </div>
        <br/>
        <div className="SmallTable">
          <h2 className="fixed"><center>{("Semaphore 1 (Signal: " + manager.S[0] + ")")}</center></h2>
          <SmallJobQueue data={manager.WaitQueueS[0]}/>
        </div>
        <br/>
        <div className="SmallTable">
          <h2 className="fixed"><center>{("Semaphore 3 (Signal: " + manager.S[2] + ")")}</center></h2>
          <SmallJobQueue data={manager.WaitQueueS[2]}/>
        </div>
        <br/>
        <div className="SmallTable">
          <h2 className="fixed"><center>{("Semaphore 5 (Signal: " + manager.S[4] + ")")}</center></h2>
          <SmallJobQueue data={manager.WaitQueueS[4]}/>
        </div>
      </div>

    </div>
    </div>
    ) : (
    <div>                
      <div className="SmallTable">
        <h2 className="fixed"><center>Ready Queue Level 1</center></h2>
        <SmallJobQueue data={manager.ReadyQueueI}/>
      </div>
      <br/>
      <div className="SmallTable">
        <h2 className="fixed"><center>Ready Queue Level 2</center></h2>
        <SmallJobQueue data={manager.ReadyQueueII}/>
      </div>
      <br/>
      <div className="SmallTable">
        <h2 className="fixed"><center>I/O Burst Queue</center></h2>
        <IOQueue data={manager.WaitQueueIO.WaitQueue}/>
      </div>
      <br/>
    </div>
  );

    // if (this.state.runfor > 0) {
    //   manager.Run(this.Run);
    // }
    return (
        <div>
          <SimHeader ref = {c => this.Header = c}
          UpdateManger={this.UpdateManager}
          Run={this.Run} Time={manager.CurrentTime}/>
          <div className="container">
            <div className="column-divider sim-column-one">  
            <div className="LargeTable">
                <h2 className="fixed"><center>New Job Queue</center></h2>
                <EventQueue data={manager.EventListOBJ}/>
              </div>              
              <br/>
              <div className="LargeTable">
                <h2 className="fixed"><center>New Job Queue</center></h2>
                <LargeJobQueue data={manager.IncomingJobsQueue}/>
              </div>
            </div>
            <div className="column-divider sim-column-two"></div>
            <div className="column-divider sim-column-three">
              {Semaphores}
            </div>
            <div className="column-divider sim-column-four"></div>
            <div className="column-divider sim-column-five">
              <div className="LargeTable">
              <h2 className="fixed"><center>CPU</center></h2>
              <h2 className="fixed"><center>{manager.CPU.GetString()}</center></h2>
              {/* <h2 className="fixed"><center>{manager.CPU.job.JobNumber}</center></h2>
              <h2 className="fixed"><center>{manager.CPU.job.NeededRunTime}</center></h2>
              <h2 className="fixed"><center>{manager.CPU.quantum}</center></h2> */}
              {/* <LargeJobQueue data={data}/> */}
                {/* <Rectangle width={395} height={400} 
                    fill={{color:'#2409ba'}} strokeWidth={1} /> */}
              </div>
              <br/>
              <div className="LargeTable">
                <h2 className="fixed"><center>Finished Job Queue</center></h2>
                <LargeJobQueue data={manager.FinishedQueue}/>
              </div>
            </div>
          </div>
        </div>
    );
  }
}
 
export default Simulator;