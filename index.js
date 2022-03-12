const { ApolloServer } = require("apollo-server")

exports.typeDefs = gql`
  type Query {
    cars: [Car!]!
  }

  type Mutation {
    groupCreate(
      # the rules are relaxed here...
      # as we're using the same group input to avoid duplication
      groupInput: GroupInput!
     )
    groupUpdate(
      groupId: ID!
      groupInput: GroupInput!
    ): GroupUpdatePayload
    groupDelete(groupId: ID!)
    groupPublish(groupId: ID!)
    groupUnpublish(groupId: ID!)
    groupAddCars(groupId: ID!, carId: ID!)
    groupRemoveCars(groupId: ID!, carId: ID!)
  }

  type GroupUpdatePayload {
    group: Group
    userErrors: [UserErrors!]!
  }

  type UserErrors {
    message: String!
    field: [String!]!
  }

  input ImageInput {
    url: String!
  }

  input GroupInput {
    name: String
    image: ImageInput
    description: String
    featureSet: GroupFeatureFields
  }

  type Car {
    id: ID!
    color: String!
    make: String!
  }

  # note: both groups are going to be replaced by one, "Group"
  # type Group {
  #   id: ID!
  #   name: String!
  #   imageId: ID!
  #   bodyHtml: String!
  # }

  # type ManualGroup {
  #   # Image
  #   # [GroupMembership] -> [Car]
  #   id: ID!
  #   name: String!
  #   imageId: ID!
  #   bodyHtml: String!
  #   memberships: [GroupMembership!]!
  # }

  # type AutomaticGroup {
  #   # Image
  #   # [GroupMembership] -> [Car]
  #   # [AutomaticGroupFeatures]
  #   id: ID!
  #   name: String!
  #   imageId: ID!
  #   bodyHtml: String!
  #   memberships: [GroupMembership!]!
  #   feature: [AutomaticGroupFeatures!]!
  #   applyFeaturesSeparately: Boolean!
  # }

  type Group {
    # Image
    # [Car]
    # [GroupFeatures]
    id: ID!
    featureSet: GroupFeatureSet
    # our API should provide business logic, not just data
    hasCar(id: ID!): Boolean!
    cars(skip: Int!, take: Int!): [Car!]!
    name: String!
    # this is not good practice!
    # we should be using object references instead of ID fields
    # imageId: ID!
    image: Image!
    # not a good name - name should make sense & not exposing implementation
    # bodyHtml: String!  # ->description
    description: String!
  }

  type Image {
    id: ID!
    url: String!
  }

  # group closely related items together into sub-objects
  type GroupFeatureSet {
    features: [GroupFeatures!]!
    applyFeaturesSeparately: Boolean!
  }

  type GroupFeatures {
    feature: GroupFeatureFields!
  }

  enum GroupFeatureFields {
    INCLINE_ENGINE
    FOUR_CYLINDER_ENGINE
    TWIN_CYLINDER_ENGINE
    RED_PAINT
    BLACK_PAINT
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
