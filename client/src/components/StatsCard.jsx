import PropTypes from 'prop-types';

function StatsCard({ label, value, icon: Icon, trend }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        {Icon ? <Icon className="h-10 w-10 text-primary" /> : null}
      </div>
      {trend ? <p className="mt-4 text-xs text-slate-500">{trend}</p> : null}
    </div>
  );
}

StatsCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType,
  trend: PropTypes.string
};

StatsCard.defaultProps = {
  icon: null,
  trend: null
};

export default StatsCard;
