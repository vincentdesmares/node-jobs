//@flow
import React, { Component } from "react";
import { Link } from "react-router-dom";

class ScenePreview extends Component {
  render() {
    return (
      <Link
        to={`/project/1/scene/${this.props.scene.id}`}
        className="db mw5 black link dim fl w-20 pa2"
        title="Frank Ocean's Blonde on Apple Music"
        href="/project/1/scene/1"
      >
        <img
          className="db ba b--black-10"
          alt="Frank Ocean Blonde Album Cover"
          src="/assets/test-output.png"
        />
        <dl className="mt2 f6 lh-copy">
          <dt className="clip">Title</dt>
          <dd className="ml0 fw9">{this.props.scene.name}</dd>
          <dt className="clip">Artist</dt>
          <dd className="ml0 gray">last edit: 22 Jan</dd>
        </dl>
      </Link>
    );
  }
}

export default ScenePreview;
