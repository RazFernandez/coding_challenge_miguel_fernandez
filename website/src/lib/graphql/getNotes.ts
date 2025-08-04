import { gql } from "@apollo/client";

export const GET_NOTES_BY_SENTIMENT = gql`
  query GetNotesBySentiment($sentiment: Sentiment, $limit: Int, $nextToken: String) {
    getNotes(sentiment: $sentiment, limit: $limit, nextToken: $nextToken) {
      items {
        id
        text
        sentiment
        dateCreated
      }
      nextToken
      scannedCount
    }
  }
`;