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

class NewStepButton extends Component {
  render() {
    const { mutate, scene } = this.props;
    let newScene = { ...scene };
    let parsedMetadata = JSON.parse(newScene.metadata);
    return (
      <div>
        <button
          onClick={() => {
            if (typeof parsedMetadata.steps == "undefined") {
              parsedMetadata.steps = [];
            }
            parsedMetadata.steps = [
              ...parsedMetadata.steps,
              { order: parsedMetadata.steps.length + 1, status: "pending" }
            ];
            newScene.metadata = JSON.stringify(parsedMetadata);
            return mutate({
              variables: { id: newScene.id, metadata: newScene.metadata }
            });
          }}
        >
          Add step
        </button>
      </div>
    );
  }
}

export default graphql(updateSceneQuery)(NewStepButton);
