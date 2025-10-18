import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import calculationService from '../services/calculationService';
import CalculationForm from '../components/CalculationForm';
import CalculationSummary from '../components/CalculationSummary';
import { toast } from 'react-toastify';
import exportService from '../services/exportService';

function CalculationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [calculation, setCalculation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalculation = async () => {
      try {
        const data = await calculationService.get(id);
        setCalculation(data);
      } catch {
        toast.error('Unable to load calculation');
      } finally {
        setLoading(false);
      }
    };
    fetchCalculation();
  }, [id]);

  const handleSubmit = async (values) => {
    try {
      await calculationService.update(id, values);
      toast.success('Calculation updated');
      navigate('/calculations');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Update failed');
    }
  };

  const handleExport = async (format) => {
    try {
      await exportService.exportCalculation(id, format);
      toast.success(`${format.toUpperCase()} export ready`);
    } catch {
      toast.error('Export failed');
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-500">Loading calculation...</p>;
  }

  if (!calculation) {
    return <p className="text-sm text-red-500">Calculation not found.</p>;
  }

  return (
    <div className="space-y-6">
      <CalculationSummary calculation={calculation} />
      <div className="flex flex-wrap gap-3">
        {['csv', 'excel', 'pdf'].map((format) => (
          <button
            key={format}
            type="button"
            onClick={() => handleExport(format)}
            className="rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
          >
            Export {format.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Update Calculation</h2>
        <CalculationForm initialValues={calculation} onSubmit={handleSubmit} submitLabel="Update Calculation" />
      </div>
    </div>
  );
}

export default CalculationDetailsPage;
