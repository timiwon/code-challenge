import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './App.css';
import ConvertCurrentcy from './components/ConvertCurrency';

function App() {
  const queryClient = new QueryClient();

  return (<QueryClientProvider client={queryClient}>
    <ConvertCurrentcy />
  </QueryClientProvider>);
};

export default App;
