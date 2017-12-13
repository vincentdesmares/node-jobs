import React, { Component } from "react";
import NewSceneForm from "./../scene/form";
import { graphql, gql } from "react-apollo";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";

class NewScenePage extends Component {
  constructor() {
    super();
    this.state = {
      redirectToScene: null
    };
  }

  render() {
    const { mutate } = this.props;
    const { redirectToScene } = this.state;

    if (redirectToScene) {
      return <Redirect to={redirectToScene} />;
    }
    return (
      <div>
        <NewSceneForm
          onSubmit={function(data) {
            console.log("Will create a new Scene", data);
            mutate({
              variables: {
                ...data,
                projectId: this.props.match.params.projectId
              }
            }).then(
              function(data) {
                this.setState({
                  redirectToScene: "/project/" +
                    this.props.match.params.projectId +
                    "/scene/" +
                    data.data.addScene.id
                });
              }.bind(this)
            );
          }.bind(this)}
        />
      </div>
    );
  }
}

NewScenePage.PropTypes = {
  mutate: PropTypes.func,
  match: PropTypes.object
};

export const addSceneQuery = gql`
  mutation addScene($name: String!, $projectId: Int!) {
    addScene(name: $name, projectId: $projectId) {
      id
      name
    }
  }
`;

export default graphql(addSceneQuery)(NewScenePage);
