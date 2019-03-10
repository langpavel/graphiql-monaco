import { GraphQLSchema, buildASTSchema, parse } from 'graphql';

const mockSchema = buildASTSchema(
  parse(`
"""
Root Query Type
"""
type TestType {
  """
  Globally unique ID
  """
  id: ID!
  """
  recursive field
  """
  test: TestType
}

"""
Root Query Type
"""
type Query {
  test(arg: String): TestType
}

schema {
  query: Query
}
`),
);

export default function currentSchema(): GraphQLSchema {
  return mockSchema;
}
