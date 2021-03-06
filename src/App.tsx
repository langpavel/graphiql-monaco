import React, { Component } from 'react';
import Editor from './Editor';
import './App.css';

const defaultQuery = `fragment FullType on __Type {
  kind name description
  fields(includeDeprecated: true) {
    name description
    args { ...InputValue }
    type { ...TypeRef }
    isDeprecated deprecationReason
  }
  inputFields { ...InputValue }
  interfaces { ...TypeRef }
  enumValues(includeDeprecated: true) {
    name description
    isDeprecated deprecationReason
  }
  possibleTypes { ...TypeRef }
}
fragment InputValue on __InputValue {
  name description
  type { ...TypeRef }
  defaultValue
}
fragment TypeRef on __Type {
  kind name ofType {
    kind name ofType {
      kind name ofType {
        kind name ofType {
          kind name ofType {
            kind name ofType {
              kind name ofType {
                kind name
              }
            }
          }
        }
      }
    }
  }
}
`;

class App extends Component {
  render() {
    return (
      <div className="App">
        <Editor width="100%" height="100%" defaultValue={defaultQuery} />
      </div>
    );
  }
}

export default App;
