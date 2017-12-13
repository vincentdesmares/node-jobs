//@flow
import React, { Component } from "react";
import { Link } from "react-router-dom";
import SceneStep from "../scene/step";
import { gql, graphql } from "react-apollo";
import NewStepButton from "../scene/stepCreate";
import AddSlot from "../scene/addSlot";
import RunGenerationButton from "../scene/runGenerationButton";

const getQuery = gql`
  query sceneQuery($id: Int!) {
    scene(id: $id) {
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

class ScenePage extends Component {
  componentWillMount() {
    this.props.subscribeToJobUpdates();
  }

  render() {
    const { scene: { scene, loading } } = this.props;

    if (loading) {
      return <p>Loading ...</p>;
    }

    const { steps } = JSON.parse(scene.metadata);
    return (
      <div className="pa2">
        <h2 className="fl">{scene.name} </h2>
        <NewStepButton scene={scene} />
        <RunGenerationButton scene={scene} />
        <div className="cb" />
        <AddSlot scene={scene} />
        <div className="ba b--black relative mt3">
          <div
            className="bg-light-gray absolute z-0"
            style={{
              width: "30%",
              height: "100%"
            }}
          />
          <div className="z-1 relative pa1 ml2">0%</div>
        </div>
        <div className="cb" />
        <div className="mt3 ba b--black flex overflow-x-scroll">
          {steps &&
            steps.map((step, index) => {
              //@todo Replace with reselect asap
              const batch = scene.batches
                ? scene.batches.find(batch => step.batchId === batch.id)
                : null;
              return <SceneStep key={index} step={step} batch={batch} />;
            })}
          <div className="cb" />
        </div>
      </div>
    );
  }
}

const subscriptionJobUpdated = gql`
subscription onJobUpdated {
  jobUpdated {
    id
    type
    name
    input
    output
    status
  }
}`;

const getWithData = graphql(getQuery, {
  name: "scene",
  options: ({ match }) => ({
    variables: {
      id: match.params.sceneId
    }
  }),
  props: ({ scene, ownProps }) => {
    const subscribeToJobUpdates = params =>
      scene.subscribeToMore({
        document: subscriptionJobUpdated,
        updateQuery(prev, { subscriptionData }) {
          const { job } = subscriptionData.data;
          if (!scene.batches) {
            return scene;
          }
          let batch = scene.batches.find(batch => batch.id = job.batchId);
          let outdatedJob = batch.jobs.find(j => j.id = job.id);
          outdatedJob = job;
          return scene;
        }
      });
    return { scene, subscribeToJobUpdates };
  }
})(ScenePage);

export default getWithData;
