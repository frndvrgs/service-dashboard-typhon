export const directivesTypeDefs = `#graphql

  # to enable addToContext directive you need to set the transformer on the graphql adapter
  # this directive add the requestType on graphql context to be used internaly through the controller onwards

  # directive @addToContext(key: String!, value: String!) on FIELD_DEFINITION
  # Example: readAccount: AccountOutput @addToContext(key: "resourceType", value: "readAccount")

`;
