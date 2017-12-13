//@flow
import React, { Component } from "react";
import { Link } from "react-router-dom";

class Header extends Component {
  render() {
    return (
      <div className="App-header white pa3">
        <Link to="/">
          <h2 className="pa0 ma0 dib link white">
            <i className="material-icons">language</i>
            Node Procgen
          </h2>
        </Link>
        <Link
          to="/jobs"
          className="link blue no-underline underline-hover fw6 ml2"
        >
          Jobs
        </Link>
      </div>
    );
  }
}

export default Header;
