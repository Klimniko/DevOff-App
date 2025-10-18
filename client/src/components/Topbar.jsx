import PropTypes from 'prop-types';
import RateBadge from './RateBadge';
import { useMemo } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';

const labels = {
  '/': 'Dashboard',
  '/calculations': 'Saved Calculations',
  '/calculations/new': 'New Calculation'
};

function Topbar({ pathname, onToggleMenu }) {
  const title = useMemo(() => {
    if (pathname.startsWith('/calculations/') && pathname !== '/calculations/new') {
      return 'Calculation Details';
    }
    return labels[pathname] || 'Overview';
  }, [pathname]);

  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onToggleMenu} className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-primary/60 hover:text-primary md:hidden">
          <Bars3Icon className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>
          <p className="text-sm text-slate-500">Real-time commission tracking for software projects.</p>
        </div>
      </div>
      <RateBadge />
    </header>
  );
}

Topbar.propTypes = {
  pathname: PropTypes.string.isRequired,
  onToggleMenu: PropTypes.func
};

Topbar.defaultProps = {
  onToggleMenu: () => {}
};

export default Topbar;
