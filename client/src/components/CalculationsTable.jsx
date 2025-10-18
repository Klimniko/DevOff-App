import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowDownTrayIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

function CalculationsTable({ data, onDelete, onExport }) {
  if (!data?.items?.length) {
    return <p className="text-sm text-slate-500">No calculations found.</p>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {['Project', 'Buying USD', 'Selling EUR', 'Rate', 'Commission EUR', 'Days', 'Date', 'Actions'].map((header) => (
              <th key={header} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.items.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50">
              <td className="px-4 py-3">
                <Link to={`/calculations/${item.id}`} className="font-semibold text-primary hover:underline">
                  {item.project_name}
                </Link>
                <p className="text-xs text-slate-500">{item.project_description?.slice(0, 60)}</p>
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">{item.buying_price_usd.toFixed(2)}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{item.selling_price_eur.toFixed(2)}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{item.exchange_rate.toFixed(4)}</td>
              <td className="px-4 py-3 text-sm font-semibold text-emerald-600">{item.commission_eur.toFixed(2)}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{item.working_days}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{format(new Date(item.calculation_date), 'PPP')}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2 text-slate-500">
                  <Link to={`/calculations/${item.id}`} className="rounded-md border border-slate-200 p-2 hover:text-primary">
                    <PencilSquareIcon className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => onExport(item.id)}
                    className="rounded-md border border-slate-200 p-2 hover:text-primary"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    className="rounded-md border border-red-200 p-2 text-red-500 hover:bg-red-50"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

CalculationsTable.propTypes = {
  data: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.object),
    meta: PropTypes.object
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired
};

export default CalculationsTable;
