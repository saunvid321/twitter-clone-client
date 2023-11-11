import { graphql } from "@/gql";

export const followUserMutation = graphql(`
  #graphql
  mutation FollowUser($to: ID!) {
    followUser(to: $to)
  }
`);

export const unfollowUserMutation = graphql(`
  #graphql
  mutation UnFollowUser($to: ID!) {
    unFollowUser(to: $to)
  }
`);