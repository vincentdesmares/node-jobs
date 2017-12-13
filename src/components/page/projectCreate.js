import React, { Component } from "react";
import NewProjectForm from "./../project/form";
import { addProjectQuery } from "./../project/graphql";
import { graphql } from "react-apollo";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";

class NewProjectPage extends Component {
  constructor() {
    super();
    this.state = {
      redirectToProject: null
    };
  }

  render() {
    const { mutate } = this.props;
    const { redirectToProject } = this.state;

    if (redirectToProject) {
      return <Redirect to={redirectToProject} />;
    }
    return (
      <div>
        <NewProjectForm
          onSubmit={function(data) {
            console.log("Will create a new project", data);
            mutate({
              variables: data
            }).then(
              function(data) {
                this.setState({
                  redirectToProject: "/project/" + data.data.addProject.id
                });
              }.bind(this)
            );
          }.bind(this)}
        />
      </div>
    );
  }
}

NewProjectPage.PropTypes = {
  mutate: PropTypes.func
};

export default graphql(addProjectQuery)(NewProjectPage);
