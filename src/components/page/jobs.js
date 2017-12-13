//@flow
import React, { Component } from "react";
import { gql, graphql } from "react-apollo";

const jobsListQuery = gql`
  query jobsListQuery {
    jobs {
      id
      type
      name
      input
      output
      status
    }
  }
`;

class JobsList extends Component {
  componentWillMount() {
    this.props.subscribeToJobUpdates({ type: "plop" });
  }
  render() {
    const { jobs: { jobs, loading } } = this.props;

    if (loading) {
      return <p>Loading ...</p>;
    }
    return (
      <ul>
        {jobs.map(job => (
          <li key={job.id}>
            {job.id}
            ,
            {" "}
            {job.type}
            ,
            {" "}
            {job.name}
            ,
            {" "}
            {job.input}
            ,
            {" "}
            {job.output}
            ,
            {" "}
            {job.status}
          </li>
        ))}
      </ul>
    );
  }
}

// A mutation is made available on a callback called `mutate`
// Other props of the wrapping component are passed through.
function AddJobButton({ mutate, type }) {
  return (
    <button
      onClick={() =>
        mutate({
          variables: { type },
          refetchQueries: [{ query: jobsListQuery }]
        })}
    >
      Add job
    </button>
  );
}

// A mutation is made available on a callback called `mutate`
// Other props of the wrapping component are passed through.
function DeleteAllJobsButton({ mutate, type }) {
  return (
    <button
      onClick={() =>
        mutate({
          variables: { type },
          refetchQueries: [{ query: jobsListQuery }]
        })}
    >
      Delete all jobs
    </button>
  );
}

const subscriptionJobUpdated = gql`
subscription onJobUpdated($type: String!){
  jobUpdated(type: $type){
    id
    type
    name
    input
    output
    status
  }
}`;

// You can also use `graphql` for GraphQL mutations
const AddJobButtonWithData = graphql(
  gql`
  mutation addJob($type: String!) {
    addJob(type: $type) {
      id
      type
      name
      input
      output
      status
    }
  }
`
)(AddJobButton);

// You can also use `graphql` for GraphQL mutations
const DeleteAllJobsButtonWithData = graphql(
  gql`
  mutation deleteAllJobs($type: String!) {
    deleteAllJobs(type: $type)
  }
`
)(DeleteAllJobsButton);

const JobsListWithData = graphql(jobsListQuery, {
  name: "jobs",
  props: ({ jobs, ownProps }) => {
    const subscribeToJobUpdates = params =>
      jobs.subscribeToMore({
        document: subscriptionJobUpdated,
        variables: {
          type: params.type
        },
        updateQuery(prev, { subscriptionData }) {
          const { commentAdded } = subscriptionData.data;
          return {
            ...prev,
            jobs: [...jobs, commentAdded]
          };
        }
      });
    return { jobs, subscribeToJobUpdates };
  }
})(JobsList);

class JobsPage extends Component {
  render() {
    return (
      <div>
        <AddJobButtonWithData type={"heightmap"} />
        <DeleteAllJobsButtonWithData type={"heightmap"} />
        <JobsListWithData />
      </div>
    );
  }
}

export default JobsPage;
