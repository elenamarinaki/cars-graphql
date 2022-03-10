const { ApolloServer } = require("apollo-server")

exports.typeDefs = gql`
  type Query {
    cars: [Car!]!
  }

  type Car {
    id: ID!
    color: String!
    make: String!
  }

  type Group {
    id: ID!
    name: String!
    imageId: ID!
    bodyHtml: String!
  }

  type ManualGroup {
    # Image
    # [GroupMembership] -> [Car]
    id: ID!
    name: String!
    imageId: ID!
    bodyHtml: String!
    memberships: [GroupMembership!]!
  }

  type AutomaticGroup {
    # Image
    # [GroupMembership] -> [Car]
    # [AutomaticGroupFeatures]
    id: ID!
    name: String!
    imageId: ID!
    bodyHtml: String!
    memberships: [GroupMembership!]!
    feature: [AutomaticGroupFeatures!]!
    applyFeaturesSeparately: Boolean!
  }

  type AutomaticGroupFeatures {
    column: String!
  }

  #  note: Never expose implementation details in your API design!
  # delete: this becomes obsolete -> see transformation above
  # type GroupMembership {
  #   # Group
  #   # Car
  #   groupId: ID!
  #   carId: ID!
  # }
`

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query: {
      cars: () => [{ id: 1, color: "blue", make: "Toyota" }],
    },
  },
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
