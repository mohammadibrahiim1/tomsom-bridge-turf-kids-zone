import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/authentication/services/authSlice/authSlice';

export const DashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className='flex h-screen bg-gray-100 overflow-hidden'>
      {/* Sidebar */}
      <aside className='w-64 bg-slate-900 text-white flex flex-col justify-between'>
        <div className='p-5'>
          <Link to='/' className='text-xl font-bold text-emerald-400'>
            TurfBooking
          </Link>
          <nav className='mt-8 space-y-2'>
            <Link to='/dashboard' className='block px-4 py-2.5 rounded hover:bg-slate-800'>
              Overview
            </Link>
            <Link to='/dashboard/my-bookings' className='block px-4 py-2.5 rounded hover:bg-slate-800'>
              My Bookings
            </Link>
          </nav>
        </div>
        <div className='p-5 border-t border-slate-800'>
          <button
            onClick={handleLogout}
            className='w-full bg-rose-600 hover:bg-rose-700 text-white py-2 rounded transition'
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className='flex-1 flex flex-col overflow-y-auto'>
        <header className='bg-white shadow-sm p-4 flex justify-between items-center px-8'>
          <h2 className='text-xl font-semibold'>Dashboard</h2>
          <Link to='/' className='text-sm text-emerald-600 hover:underline'>
            ← Back to Site
          </Link>
        </header>
        <main className='p-8 flex-1'>
          <Outlet /> {/* Private Dashboard Pages Render Here */}
        </main>
      </div>
    </div>
  );
};
