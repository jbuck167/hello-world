import React, { Component } from "react";
import "./Queues.css";
 
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

class LargeJobQueue extends Component {
    render() {
      return (
        <div className="">
          <ReactTable 
            resizable={false}
            sortable={false}
            showPageSizeOptions={false}
            data={this.props.data}
            columns={[
                {
                  Header: "Job #",
                  accessor: "JobNumber",
                  minWidth: 90
                },
                {
                  Header: "Memory",
                  id: "memory",
                  accessor: "Memory",
                  minWidth: 100
                },
                {
                    Header: "Run Time",
                    id: "Runtime",
                    accessor: d => (d.NeededRunTime - d.RunTime),
                    minWidth: 100
                }
              ]
            }
        //     defaultSorted={[
        //     {
        //       id: "arrivalTime",
        //       desc: false
        //     }
        //   ]}
          defaultPageSize={10}
          style={{
            height: "420px" // This will force the table body to overflow and scroll, since there is not enough room
          }}
          className="-striped -highlight"
        />
      </div>
      );
    }
  }

  export default LargeJobQueue;