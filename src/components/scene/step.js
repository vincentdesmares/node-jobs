//@flow
import React, { Component } from "react";
import Slot from "./slot";

class Step extends Component {
  render() {
    return (
      <div className="fl w-20 br b--black">
        <p className="ma1 nowrap">Step {this.props.step.order}</p>
        {this.props.step.batchId &&
          <p className="ma1">Batch: {this.props.step.batchId}</p>}
        {this.props.step.slots &&
          this.props.step.slots.map(slot => {
            //@todo Replace with reselect asap
            const job = this.props.batch && this.props.batch.jobs
              ? this.props.batch.jobs.find(job => slot.jobId == job.id)
              : null;
            return <Slot key={slot.id} slot={slot} job={job} />;
          })}
      </div>
    );
  }
}

export default Step;
