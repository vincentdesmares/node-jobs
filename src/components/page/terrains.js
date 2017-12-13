//@flow
import React, { Component } from "react";
import TerrainList from "../terrain/list";
import { Link } from "react-router-dom";

class TerrainsPage extends Component {
  render() {
    return (
      <div>
        <span>
          Welcome to project {this.props.match.params.projectId} terrains
        </span>
        <Link
          to="/project/new"
          title="Will open the project creation page"
          className="no-underline near-white bg-animate bg-near-black hover-bg-gray inline-flex items-center ma1 tc br2 pa1 fr mr2 mt2"
        >
          <i className="material-icons">add_circle</i>
          <span className="f6 ml1 pr2">Add terrain</span>
        </Link>
        <div className="cb" />
        <TerrainList />
      </div>
    );
  }
}

export default TerrainsPage;
