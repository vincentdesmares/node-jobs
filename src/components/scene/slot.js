//@flow
import React, { Component } from "react";

class Slot extends Component {
  render() {
    let statusIcon = null;
    let backgroundColor = "bg-white";
    if (this.props.job) {
      switch (this.props.job.status) {
        case "processing":
          statusIcon = <i className="material-icons rotating">refresh</i>;
          backgroundColor = "bg-light-yellow";
          break;
        case "pending":
          statusIcon = <i className="material-icons">list</i>;
          break;
        case "done":
          statusIcon = <i className="material-icons">check</i>;
          backgroundColor = "bg-light-green";
          break;
        case "failed":
          statusIcon = <i className="material-icons">error</i>;
          backgroundColor = "bg-light-red";
          break;
        default:
          break;
      }
    }

    return (
      <div className={`ba b--blue ma1 pa1 ${backgroundColor}`}>
        {statusIcon}
        {this.props.job ? `Job[${this.props.job.id}] :` : ""}
        {" "}
        Generate
        {" "}
        {this.props.slot.type}
      </div>
    );
  }
}

export default Slot;
