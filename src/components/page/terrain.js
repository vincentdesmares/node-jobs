//@flow
import React, { Component } from "react";
import Terrain3dPreview from "../terrain/preview-3d";

class TerrainPage extends Component {
  render() {
    return (
      <div>
        <span>Welcome to project {this.props.match.params.projectId} </span>
        <span>Terrain {this.props.match.params.terrainId} </span>
        <Terrain3dPreview />
      </div>
    );
  }
}

export default TerrainPage;
