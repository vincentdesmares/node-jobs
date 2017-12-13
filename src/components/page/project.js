//@flow
import React, { Component } from "react";
import { Link } from "react-router-dom";

class ProjectPage extends Component {
  render() {
    return (
      <div>
        <span>Welcome to project {this.props.match.params.projectId} </span>
        <div>
          <Link to={`/project/${this.props.match.params.projectId}/terrain`}>
            <i className="material-icons">landscape</i> Terrains
          </Link>
        </div>
        <div>
          <Link to={`/project/${this.props.match.params.projectId}/zoning`}>
            <i className="material-icons">texture</i> Zonings
          </Link>
        </div>
        <div>
          <Link to={`/project/${this.props.match.params.projectId}/placements`}>
            <i className="material-icons">blur_on</i> Placements
          </Link>
        </div>
        <div>
          <Link to={`/project/${this.props.match.params.projectId}/entities`}>
            <i className="material-icons">nature</i> Entities
          </Link>
        </div>
        <div>
          <Link to={`/project/${this.props.match.params.projectId}/assets`}>
            <i className="material-icons">color_lens</i> Assets
          </Link>
        </div>
        <div>
          <Link to={`/project/${this.props.match.params.projectId}/scene`}>
            <i className="material-icons">remove_red_eyes</i> scenes
          </Link>
        </div>
      </div>
    );
  }
}

export default ProjectPage;
