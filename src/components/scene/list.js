//@flow
import React, { Component } from "react";
import ScenePreview from "./preview";
import { gql, graphql } from "react-apollo";

const listQuery = gql`
  query projectListQuery($projectId: Int) {
    scenes(projectId: $projectId) {
      id
      name
    }
  }
`;

class SceneList extends Component {
  render() {
    const { scenes: { scenes, loading } } = this.props;

    if (loading) {
      return <p>Loading ...</p>;
    }

    return (
      <div>
        {scenes.map(scene => <ScenePreview key={scene.id} scene={scene} />)}
      </div>
    );
  }
}

const listWithData = graphql(listQuery, {
  name: "scenes",
  options: ({ projectId }) => ({
    variables: {
      projectId
    }
  })
})(SceneList);

export default listWithData;
