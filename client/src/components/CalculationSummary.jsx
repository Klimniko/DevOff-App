import PropTypes from 'prop-types';
import { format } from 'date-fns';

function CalculationSummary({ calculation }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">{calculation.project_name}</h2>
          <p className="text-sm text-slate-500">{calculation.project_description}</p>
        </div>
        <div className="text-right text-sm text-slate-500">
          <p>Calculation date: {format(new Date(calculation.calculation_date), 'PPP')}</p>
          <p>Exchange rate: {calculation.exchange_rate.toFixed(4)}</p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase text-slate-500">Buying Price (USD)</p>
          <p className="mt-2 text-lg font-bold text-slate-800">{calculation.buying_price_usd.toFixed(2)}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase text-slate-500">Selling Price (EUR)</p>
          <p className="mt-2 text-lg font-bold text-slate-800">{calculation.selling_price_eur.toFixed(2)}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase text-slate-500">Commission (EUR)</p>
          <p className="mt-2 text-lg font-bold text-emerald-600">{calculation.commission_eur.toFixed(2)}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase text-slate-500">Working Days</p>
          <p className="mt-2 text-lg font-bold text-slate-800">{calculation.working_days}</p>
        </div>
      </div>
      <div className="mt-6 text-xs text-slate-500">
        {calculation.created_at ? <p>Created: {format(new Date(calculation.created_at), 'PPpp')}</p> : null}
        {calculation.updated_at ? <p>Last updated: {format(new Date(calculation.updated_at), 'PPpp')}</p> : null}
      </div>
    </div>
  );
}

CalculationSummary.propTypes = {
  calculation: PropTypes.shape({
    project_name: PropTypes.string,
    project_description: PropTypes.string,
    buying_price_usd: PropTypes.number,
    selling_price_eur: PropTypes.number,
    exchange_rate: PropTypes.number,
    commission_eur: PropTypes.number,
    working_days: PropTypes.number,
    calculation_date: PropTypes.string,
    created_at: PropTypes.string,
    updated_at: PropTypes.string
  }).isRequired
};

export default CalculationSummary;
