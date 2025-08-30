import './App.css'
import { ApolloProvider } from '@apollo/client/react'
import client from './apollo/client'
import Dashboard from './pages/Dashboard'
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <ApolloProvider client={client}>
      <Toaster position="top-right" />
      <Dashboard />
    </ApolloProvider>
  );
}

export default App;
