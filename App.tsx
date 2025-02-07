import React from 'react';
import {ApolloProvider} from '@apollo/client';
import client from './src/apollo/apolloClient';
import AppNavigator from './src/navigation/AppNavigator';

function App() {
  return (
    <ApolloProvider client={client}>
      <AppNavigator />;
    </ApolloProvider>
  );
}

export default App;
