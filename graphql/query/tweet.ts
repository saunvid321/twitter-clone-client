import { graphql } from "@/gql";

export const getAllTweetsQuery = graphql(`
  #graphql

  query GetAllTweets {
    getAllTweets {
      id
      content
      imageURL
      author {
        id
        firstName
        lastName
        profileImageURL
      }
    }
  }
`);

export const getSignedUrlForTweet= graphql(`
query GetSignedURL ( $imageName: String!, $imageType: String!) {
 
 
  getSignedURLForTweet(imageName: $imageName, imageType: $imageType)
}
`);
