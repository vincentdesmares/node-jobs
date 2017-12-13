//@flow
import React, { Component } from "react";
import TerrainPreview from "./preview";

class TerrainList extends Component {
  render() {
    return (
      <div>
        <TerrainPreview />
        <TerrainPreview />
        <TerrainPreview />
        <TerrainPreview />
        <TerrainPreview />
        <TerrainPreview />
      </div>
    );
  }
}

export default TerrainList;
