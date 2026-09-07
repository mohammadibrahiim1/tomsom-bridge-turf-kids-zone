import { RouterProvider } from '@tanstack/react-router';
import { router } from './routes/router';
import { AuthInitializer } from './components/AuthInitializer/AuthInitializer';

export default function App() {
  return (
    <AuthInitializer>
      <RouterProvider router={router} />
    </AuthInitializer>
  );
}
