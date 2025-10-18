import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { useRate } from '../contexts/RateContext';
import clsx from 'clsx';

const defaultValues = {
  project_name: '',
  project_description: '',
  buying_price_usd: '',
  selling_price_eur: '',
  working_days: '',
  calculation_date: format(new Date(), 'yyyy-MM-dd')
};

function CalculationForm({ initialValues, onSubmit, submitLabel }) {
  const { rate } = useRate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: { ...defaultValues, ...initialValues }
  });

  const buying = parseFloat(watch('buying_price_usd') || 0);
  const selling = parseFloat(watch('selling_price_eur') || 0);
  const workingDays = parseInt(watch('working_days') || 0, 10);
  const effectiveRate = initialValues?.exchange_rate || rate || 0;

  useEffect(() => {
    if (!initialValues) {
      setValue('calculation_date', format(new Date(), 'yyyy-MM-dd'));
    }
  }, [initialValues, setValue]);

  const commission = useMemo(() => {
    if (!effectiveRate) return 0;
    const converted = buying * effectiveRate;
    return selling - converted;
  }, [buying, selling, effectiveRate]);

  const handleFormSubmit = (values) => {
    onSubmit({
      ...values,
      buying_price_usd: parseFloat(values.buying_price_usd),
      selling_price_eur: parseFloat(values.selling_price_eur),
      working_days: parseInt(values.working_days, 10),
      commission_eur: parseFloat(commission.toFixed(2)),
      exchange_rate: effectiveRate
    });
  };

  return (
    <form className="grid grid-cols-1 gap-6 lg:grid-cols-2" onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-600">Project Name</label>
          <input
            type="text"
            className={clsx('mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20', {
              'border-red-500 focus:border-red-500 focus:ring-red-200': errors.project_name
            })}
            {...register('project_name', { required: 'Project name is required' })}
          />
          {errors.project_name ? <p className="mt-1 text-xs text-red-500">{errors.project_name.message}</p> : null}
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-600">Project Description</label>
          <textarea
            className="mt-1 h-32 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register('project_description')}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-600">Calculation Date</label>
          <input
            type="date"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register('calculation_date', { required: true })}
          />
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-slate-600">Buying Price (USD)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              {...register('buying_price_usd', { required: 'Buying price is required', min: { value: 0, message: 'Value must be positive' } })}
            />
            {errors.buying_price_usd ? <p className="mt-1 text-xs text-red-500">{errors.buying_price_usd.message}</p> : null}
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">Selling Price (EUR)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              {...register('selling_price_eur', { required: 'Selling price is required', min: { value: 0, message: 'Value must be positive' } })}
            />
            {errors.selling_price_eur ? <p className="mt-1 text-xs text-red-500">{errors.selling_price_eur.message}</p> : null}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-slate-600">Working Days</label>
            <input
              type="number"
              min="1"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              {...register('working_days', { required: 'Working days are required', min: { value: 1, message: 'Must be at least 1 day' } })}
            />
            {errors.working_days ? <p className="mt-1 text-xs text-red-500">{errors.working_days.message}</p> : null}
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">Exchange Rate Used</label>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2"
              value={effectiveRate ? effectiveRate.toFixed(4) : ''}
              readOnly
            />
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-600">Commission Preview</h3>
          <p className="mt-2 text-2xl font-bold text-primary">{commission ? commission.toFixed(2) : '0.00'} EUR</p>
          <p className="text-xs text-slate-500">
            Buying price converted to EUR: {(buying * effectiveRate).toFixed(2)} • Difference: {commission.toFixed(2)}
          </p>
          <p className="mt-2 text-xs text-slate-500">Working days total (estimate): {(workingDays * selling).toFixed(2)} EUR</p>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}

CalculationForm.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  submitLabel: PropTypes.string
};

CalculationForm.defaultProps = {
  initialValues: null,
  submitLabel: 'Save Calculation'
};

export default CalculationForm;
