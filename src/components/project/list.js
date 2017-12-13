//@flow
import React, { Component } from "react";
import ProjectPreview from "./preview";
import { gql, graphql } from "react-apollo";

const projectListQuery = gql`
  query projectListQuery {
    projects {
      id
      name
    }
  }
`;

class ProjectList extends Component {
  render() {
    const { projects: { projects, loading } } = this.props;

    if (loading) {
      return <p>Loading ...</p>;
    }

    return (
      <div>
        {projects.map(project => (
          <ProjectPreview key={project.id} project={project} />
        ))}
      </div>
    );
  }
}
const projectListWithData = graphql(projectListQuery, { name: "projects" })(
  ProjectList
);

export default projectListWithData;
