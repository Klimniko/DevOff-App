import { useCallback, useEffect, useState } from 'react';
import calculationService from '../services/calculationService';
import CalculationsTable from '../components/CalculationsTable';
import Pagination from '../components/Pagination';
import FilterBar from '../components/FilterBar';
import { toast } from 'react-toastify';
import useDebounce from '../hooks/useDebounce';
import exportService from '../services/exportService';

const initialFilters = {
  search: '',
  startDate: '',
  endDate: '',
  page: 1,
  pageSize: 10,
  sortBy: 'calculation_date',
  sortOrder: 'desc'
};

function CalculationsListPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const debouncedFilters = useDebounce(filters, 400);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await calculationService.list(debouncedFilters);
      setData(response);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch calculations');
    } finally {
      setLoading(false);
    }
  }, [debouncedFilters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (updates) => {
    setFilters((prev) => ({ ...prev, ...updates, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this calculation?')) return;
    try {
      await calculationService.remove(id);
      toast.success('Calculation removed');
      fetchData();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to delete calculation');
    }
  };

  const handleExport = async (id) => {
    try {
      await exportService.exportCalculation(id, 'pdf');
      toast.success('Export started');
    } catch {
      toast.error('Export failed');
    }
  };

  return (
    <div className="space-y-6">
      <FilterBar initialFilters={initialFilters} onFilter={handleFilterChange} />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Saved Calculations</h2>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Sort by:</span>
            <select
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={`${filters.sortBy}:${filters.sortOrder}`}
              onChange={(event) => {
                const [sortBy, sortOrder] = event.target.value.split(':');
                setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
              }}
            >
              <option value="calculation_date:desc">Date (newest)</option>
              <option value="calculation_date:asc">Date (oldest)</option>
              <option value="commission_eur:desc">Commission (high)</option>
              <option value="commission_eur:asc">Commission (low)</option>
              <option value="project_name:asc">Project (A-Z)</option>
            </select>
          </div>
        </div>
        {loading ? <p className="mt-4 text-sm text-slate-500">Loading calculations...</p> : null}
        <div className="mt-4">
          <CalculationsTable data={data} onDelete={handleDelete} onExport={handleExport} />
        </div>
        <Pagination page={filters.page} pageSize={filters.pageSize} total={data.total || 0} onChange={handlePageChange} />
      </div>
    </div>
  );
}

export default CalculationsListPage;
