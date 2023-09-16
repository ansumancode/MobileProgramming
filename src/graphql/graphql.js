import { gql } from '@apollo/client';

// Graph QL get data query
export const GET_ALL_DATA_SETS = gql`
  query {
    allDataSetJsons {
      url
      info
      externalDocs
    }
  }
`;