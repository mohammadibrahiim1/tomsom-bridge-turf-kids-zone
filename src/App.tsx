import { RouterProvider } from '@tanstack/react-router';
import { router } from './routes/router';
import { AuthInitializer } from './components/AuthInitializer/AuthInitializer';
import  { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <AuthInitializer>
         <Toaster />
      <RouterProvider router={router} />
    </AuthInitializer>
  );
}
