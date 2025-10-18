import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bars3Icon, ChartPieIcon, PlusIcon, RectangleStackIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';

const navItems = [
  { name: 'Dashboard', to: '/', icon: ChartPieIcon },
  { name: 'New Calculation', to: '/calculations/new', icon: PlusIcon },
  { name: 'Calculations', to: '/calculations', icon: RectangleStackIcon }
];

function Sidebar({ open, onClose }) {
  const { logout, user } = useAuth();

  return (
    <aside className={`w-72 bg-secondary text-white shadow-lg transition-all duration-300 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} fixed z-30 h-full md:static`}>
      <div className="flex items-center justify-between px-6 py-6 md:py-8">
        <div>
          <div className="text-xl font-bold">DevOff Solutions</div>
          <p className="text-sm text-slate-300">Commission Calculator</p>
        </div>
        <button className="rounded-md p-2 text-white md:hidden" onClick={onClose}>
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>
      <nav className="px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `mb-2 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition hover:bg-slate-700 ${isActive ? 'bg-primary text-white' : 'text-slate-200'}`
            }
            onClick={onClose}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-3 px-6 py-6 text-sm text-slate-200">
        <div>
          <p className="font-semibold">Logged in as</p>
          <p className="text-slate-300">{user?.username}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 font-semibold transition hover:bg-slate-600"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
};

Sidebar.defaultProps = {
  open: false,
  onClose: () => {}
};

export default Sidebar;
