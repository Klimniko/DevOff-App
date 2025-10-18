import { useNavigate } from 'react-router-dom';
import calculationService from '../services/calculationService';
import CalculationForm from '../components/CalculationForm';
import { toast } from 'react-toastify';

function NewCalculationPage() {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      await calculationService.create(values);
      toast.success('Calculation saved successfully');
      navigate('/calculations');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to save calculation');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Create New Calculation</h2>
        <p className="text-sm text-slate-500">Provide project details and pricing to compute commission with the latest exchange rate.</p>
      </div>
      <CalculationForm onSubmit={handleSubmit} submitLabel="Save Calculation" />
    </div>
  );
}

export default NewCalculationPage;
