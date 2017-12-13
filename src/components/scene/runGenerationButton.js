import React, { Component } from "react";
import NewSceneForm from "./../scene/form";
import { graphql, gql } from "react-apollo";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";

export const runGenerationQuery = gql`
  mutation runGeneration($sceneId: Int!) {
    runGeneration(sceneId: $sceneId) {
      id
      name
      status
      metadata
      batches {
        id
        jobs {
          id
          type
          name
          status
        }
      }
    }
  }
`;

class RunGenerationButton extends Component {
  render() {
    const { mutate, scene } = this.props;
    let newScene = { ...scene };
    let parsedMetadata = JSON.parse(newScene.metadata);
    return (
      <div>
        <a
          onClick={() => {
            return mutate({
              variables: { sceneId: scene.id }
            });
          }}
          title="Will open the project creation page"
          className="no-underline near-white bg-animate bg-near-black hover-bg-gray inline-flex items-center ma1 tc br2 pa1 fr mr2 mt2"
        >
          <i className="material-icons">play_arrow</i>
          <span className="f6 ml1 pr2">Run generation</span>
        </a>
      </div>
    );
  }
}

export default graphql(runGenerationQuery)(RunGenerationButton);
