//@flow
import React, { Component } from "react";
import { Link } from "react-router-dom";

class ZoningsPage extends Component {
  render() {
    return (
      <div>
        <span>
          Welcome to project {this.props.match.params.projectId} zonings
        </span>
        <Link
          to="/project/new"
          title="Will open the project creation page"
          className="no-underline near-white bg-animate bg-near-black hover-bg-gray inline-flex items-center ma1 tc br2 pa1 fr mr2 mt2"
        >
          <i className="material-icons">add_circle</i>
          <span className="f6 ml1 pr2">Add Zoning</span>
        </Link>
        <div className="cb" />
        <div
          className="ba b--black w-30 fl"
          style={{
            height: 400
          }}
        >
          <h2>Height-based</h2>
          <div>
            <span className="tw1">0-50 sea</span>
          </div>
          <div>
            <span className="tw1">50-100 land</span>
          </div>
          <div>
            <span className="tw1">80-110 montain</span>
          </div>
        </div>
        <div
          className="ba b--black w-30 fl"
          style={{
            height: 400
          }}
        >
          <h2>Slope-based</h2>
          <div>
            <span className="tw1">0-10% flat-slope</span>
          </div>
          <div>
            <span className="tw1">10-20% medium-slope</span>
          </div>
          <div>
            <span className="tw1">20-35% hill-slope</span>
          </div>
          <div>
            <span className="tw1">35-55% hard-slope</span>
          </div>
          <div>
            <span className="tw1">55+ wall-slope</span>
          </div>
        </div>
      </div>
    );
  }
}

export default ZoningsPage;
