import { ArrowPathIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { useRate } from '../contexts/RateContext';

function RateBadge({ className = '' }) {
  const { rate, timestamp, loading, refresh } = useRate();

  return (
    <div className={`flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm ${className}`}>
      <div>
        <p className="font-semibold text-slate-700">USD → EUR</p>
        <p className="text-xs text-slate-500">
          {timestamp ? `Updated ${format(new Date(timestamp), 'PPpp')}` : 'Awaiting rate'}
        </p>
      </div>
      <div className="text-lg font-bold text-primary">{rate ? rate.toFixed(4) : '---'}</div>
      <button
        type="button"
        onClick={refresh}
        className="rounded-full border border-primary p-2 text-primary transition hover:bg-primary hover:text-white"
        disabled={loading}
      >
        <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
}

RateBadge.propTypes = {
  className: PropTypes.string
};

export default RateBadge;
