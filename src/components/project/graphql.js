import { gql } from "react-apollo";

export const addProjectQuery = gql`
  mutation addProject($name: String!) {
    addProject(name: $name) {
      id
      name
    }
  }
`;
