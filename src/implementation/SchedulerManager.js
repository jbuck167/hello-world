import Job from "./job";
import CPU from "./cpu";
import WaitQueueIO from "./WaitQueueIO";
import Event from "./Event";

class SchedulerManager {
    constructor() {
        this.CurrentTime = 0;
        this.Memory = 512;
        this.FreeMemory = 512;
        this.EventListOBJ = [];
        this.PermEventListOBJ = [];
        this.IncomingJobsQueue = [];
        this.ReadyQueueI= [];
        this.ReadyQueueII= [];
        this.WaitQueueIO = new WaitQueueIO();
        this.CPU = new CPU();
        this.FinishedQueue= [];
        this.S=[1,1,1,1,1];
        this.WaitQueueS = [[],[],[],[],[]];
        this.Run = this.Run.bind(this);
        this.ReadText = this.ReadText.bind(this);
    }

    Reset() {
        this.CurrentTime = 0;
        this.Memory = 512;
        this.FreeMemory = 512;
        this.IncomingJobsQueue = [];
        this.ReadyQueueI= [];
        this.ReadyQueueII= [];
        this.WaitQueueIO = new WaitQueueIO();
        this.CPU = new CPU();
        this.FinishedQueue= [];
        this.S=[1,1,1,1,1];
        this.WaitQueueS = [[],[],[],[],[]];
        this.EventListOBJ = [];
        this.PermEventListOBJ.forEach(element => {
            this.EventListOBJ.push(element)
        });
    }

    ReadText(text) {
        var nEventListOBJ = [];
        var nEventListOBJCopy = [];
        var lines = text.split('\n');
        for(var line = 0; line < lines.length; line++) {
            var newEvent = new Event(lines[line]);
            nEventListOBJCopy.push(newEvent);
            nEventListOBJ.push(newEvent);  
        }

        nEventListOBJ.sort(function(a,b){
            if (a.arrivalTime > b.arrivalTime) {
                return 1;
            }
            if (a.arrivalTime < b.arrivalTime) {
                return -1;
            }
            return 0;
        });

        this.EventListOBJ = nEventListOBJ;
        this.PermEventListOBJ = nEventListOBJCopy;
    }

    EventList() {
        return this.EventListOBJ;
    }

    CheckEventQueue() {
        if(this.EventListOBJ.length > 0 && this.EventListOBJ[0].arrivalTime === this.CurrentTime) 
        {
            var newEvent = this.EventListOBJ.shift();
            // console.log(newEvent);

            if (newEvent.type === 'A') {
                if(newEvent.memory > this.Memory) {
                    console.log("Rejected Job " + newEvent.number + 
                        " requiring " + newEvent.memory + " memory");
                    // alert("The system rejected job " + newEvent.number + 
                    //     " for requiring " + newEvent.memory + " units of memory. The maximum memory is 512 units.");
                    return true;
                }
                this.IncomingJobsQueue.push(new Job(
                    newEvent.number, 
                    newEvent.arrivalTime, 
                    newEvent.runtime, 
                    newEvent.memory));
            }
            else if (newEvent.type === 'I') {
                if (this.CPU.idle) {
                    console.log("I/O Wait Event but CPU was Idle at time: " + this.CurrentTime);
                    alert("An event occurred that effects the current running process but the CPU was idle.");
                }
                var IOJob = this.CPU.job;
                this.WaitQueueIO.AddJob(IOJob, newEvent.burstTime);
                this.CPU.idle = true;
                this.RunScheduling();
            }
            else if (newEvent.type === 'S') {
                if (newEvent.semaphore < 0 || newEvent.semaphore > 4) {
                    console.log("Semaphore " + newEvent.semaphore + " Signal Failed");
                    alert("Semaphore " + newEvent.semaphore + " Signal Failed");
                }
                else  {
                    if(this.WaitQueueS[newEvent.semaphore].length >0) {
                        this.ReadyQueueI.push(this.WaitQueueS[newEvent.semaphore].shift());
                    } else {
                        this.S[newEvent.semaphore]++;
                    }
                }
            }
            else if (newEvent.type === 'W') {
                if (newEvent.semaphore < 0 || newEvent.semaphore > 4) {
                    console.log("Semaphore " + newEvent.semaphore + " Signal Failed");
                    alert("Semaphore " + newEvent.semaphore + " Signal Failed");
                }
                else  {
                    if (this.S[newEvent.semaphore] > 0) {
                        this.S[newEvent.semaphore]--;
                    }
                    else {
                        this.WaitQueueS[newEvent.semaphore].push(this.CPU.job);
                        this.CPU.idle = true;
                        this.RunScheduling();
                    }
                }
            }

            return true;
        }
        return false;
    }

    RunScheduling() {
        // Process Incoming Jobs
        while (this.IncomingJobsQueue.length > 0 && this.IncomingJobsQueue[0].Memory <= this.FreeMemory) {
            var job = this.IncomingJobsQueue.shift();
            this.FreeMemory = this.FreeMemory - job.Memory;
            this.ReadyQueueI.push(job);
        }
        if (this.CPU.idle) {
            if (this.ReadyQueueI.length > 0) {
                this.CPU.AddJob(this.ReadyQueueI.shift(), 100);
                    
            }
            else if (this.ReadyQueueII.length > 0) {
                this.CPU.AddJob(this.ReadyQueueII.shift(), 200);
            }
        }
    }

    Run(ticks) {
        for (var i = 0; i < ticks; i++) {
            // Incriment Current Time
            this.CurrentTime++;

            // Handle All Events
            while( this.CheckEventQueue() ){}
            // Run CPU and IO
            if(this.CPU.Run(this.CurrentTime)) {
                if(this.CPU.job.Done) {
                    this.FinishedQueue.push(this.CPU.job);
                    this.FreeMemory += this.CPU.job.Memory;
                }
                else {
                    this.ReadyQueueII.push(this.CPU.job);
                }
            }
            var jobs = this.WaitQueueIO.RunJobs();
            jobs.forEach(job => {
                this.ReadyQueueI.push(job);
            });
            // Run Scheduling
            this.RunScheduling();
            
        }
    }
}

export default SchedulerManager;