//@flow
import React, { Component } from "react";
import { Entity, Scene } from "aframe-react";

class Terrain3dPreview extends Component {
  render() {
    return (
      <div className="db mw5 dim fl w-20 pa2">
        <div
          className=""
          style={{
            width: 400,
            height: 400
          }}
        >
          <Scene embedded>
            <Entity
              position={{ x: 0, y: 80, z: 80 }}
              rotation={{ x: -50, y: 0, z: 0 }}
              camera
              look-controls
              wasd-controls={{ acceleration: 200 }}
            />
            <Entity
              color-terrain-model={{
                colorScheme: "magma",
                DEM: "url(/assets/test.bin)",
                planeWidth: 100,
                planeHeight: 100,
                segmentsWidth: 99,
                segmentsHeight: 99,
                zPosition: 40,
                wireframe: true
              }}
            />
            <Entity
              terrain-model={{
                texture: "url(/assets/test-output.png)",
                DEM: "url(/assets/test.bin)",
                alphaMap: "url(/assets/test-output-bicolor.png)",
                planeWidth: 100,
                planeHeight: 100,
                segmentsWidth: 99,
                segmentsHeight: 99,
                zPosition: 40
              }}
            />
            <Entity
              geometry={{ primitive: "box" }}
              material={{ color: "red" }}
              position={{ x: 0, y: 0, z: -5 }}
            />
            <Entity
              geometry={{ primitive: "box" }}
              material={{ color: "red" }}
              position={{ x: 0, y: 10, z: -5 }}
            />
            <Entity
              geometry={{ primitive: "box" }}
              material={{ color: "red" }}
              position={{ x: 0, y: 20, z: -5 }}
            />
            <Entity
              geometry={{ primitive: "box" }}
              material={{ color: "red" }}
              position={{ x: 0, y: 30, z: -5 }}
            />
            <Entity
              geometry={{ primitive: "box" }}
              material={{ color: "red" }}
              position={{ x: 0, y: 40, z: -5 }}
            />
            <Entity
              geometry={{ primitive: "box" }}
              material={{ color: "red" }}
              position={{ x: 0, y: 50, z: -5 }}
            />
            <Entity
              geometry={{ primitive: "box" }}
              material={{ color: "red" }}
              position={{ x: 0, y: 60, z: -5 }}
            />
          </Scene>
        </div>
      </div>
    );
  }
}

export default Terrain3dPreview;
