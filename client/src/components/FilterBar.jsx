import PropTypes from 'prop-types';
import { useState } from 'react';

function FilterBar({ initialFilters, onFilter }) {
  const [filters, setFilters] = useState(initialFilters);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    const resetFilters = { search: '', startDate: '', endDate: '' };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  return (
    <form className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-5" onSubmit={handleSubmit}>
      <div className="md:col-span-2">
        <label className="text-xs font-semibold uppercase text-slate-500">Search by name</label>
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Project name"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase text-slate-500">Start date</label>
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleChange}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase text-slate-500">End date</label>
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleChange}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <div className="flex items-end gap-2">
        <button type="submit" className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
          Apply
        </button>
        <button type="button" onClick={handleReset} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">
          Reset
        </button>
      </div>
    </form>
  );
}

FilterBar.propTypes = {
  initialFilters: PropTypes.shape({
    search: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string
  }).isRequired,
  onFilter: PropTypes.func.isRequired
};

export default FilterBar;
