import { gql } from "@apollo/client";

export const GET_BOUNTIES = gql`
  query MyQuery {
    bounties {
      id
      isActive
      creationBlock
      creator
      description
      duration
      judgeTime
      maxProgress
      mediaURI
      name
      numAcceptedSubmissions
      reward
      submissions {
        eegDataHash
        id
        submitter
      }
    }
  }
`;
