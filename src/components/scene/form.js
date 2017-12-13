//@flow
import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";

class NewScene extends Component {
  render() {
    const { handleSubmit } = this.props;
    return (
      <form className="pa4 black-80" onSubmit={handleSubmit}>
        <div className="measure">
          <label htmlFor="name" className="f6 b db mb2">
            Name <span className="normal black-60">(optional)</span>
          </label>
          <Field
            name="name"
            component="input"
            type="text"
            placeholder="Scene Name"
            props={{
              className: "input-reset ba b--black-20 pa2 mb2 db w-100"
            }}
          />
          <small id="name-desc" className="f6 black-60 db mb2">
            Helper text for the form control.
          </small>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  // a unique name for the form
  form: "Scene"
})(NewScene);
