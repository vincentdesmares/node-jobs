import React, { Component } from "react";
import NewSceneForm from "./../scene/form";
import { graphql, gql } from "react-apollo";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";

export const updateSceneQuery = gql`
  mutation updateScene($id: Int!, $metadata: String!) {
    updateScene(id: $id, metadata: $metadata) {
      id
      name
      status
      metadata
    }
  }
`;

class NewSlotButton extends Component {
  constructor() {
    super();
    this.state = { stepIndex: 0 };
  }
  render() {
    const { mutate, scene } = this.props;
    let newScene = { ...scene };
    let parsedMetadata = JSON.parse(newScene.metadata);
    return (
      <div>
        <div>
          <select
            onChange={event => {
              this.setState({ stepIndex: event.target.value });
            }}
          >
            {parsedMetadata &&
              parsedMetadata.steps &&
              parsedMetadata.steps.map(step => (
                <option key={step.order} value={step.order - 1}>
                  {step.order}
                </option>
              ))}
          </select>
          <span
            className="ba b--black pa2"
            onClick={() => {
              if (typeof parsedMetadata.steps == "undefined") {
                parsedMetadata.steps = [];
              }
              if (
                typeof parsedMetadata.steps[this.state.stepIndex].slots ==
                "undefined"
              ) {
                parsedMetadata.steps[this.state.stepIndex].slots = [];
              }
              if (typeof parsedMetadata.slotCount == "undefined") {
                parsedMetadata.slotCount = 0;
              }

              parsedMetadata.steps[this.state.stepIndex].slots.push({
                type: "heightmap",
                status: "unassigned",
                id: parsedMetadata.slotCount + 1
              });
              parsedMetadata.slotCount += 1;
              newScene.metadata = JSON.stringify(parsedMetadata);
              return mutate({
                variables: { id: newScene.id, metadata: newScene.metadata }
              });
            }}
          >
            Click me to add a heightmap job
          </span>
        </div>
      </div>
    );
  }
}

export default graphql(updateSceneQuery)(NewSlotButton);
