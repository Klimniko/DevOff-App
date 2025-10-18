import PropTypes from 'prop-types';
import clsx from 'clsx';

function Pagination({ page, pageSize, total, onChange }) {
  const pageCount = Math.ceil(total / pageSize) || 1;

  if (pageCount <= 1) {
    return null;
  }

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {pages.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          className={clsx('rounded-md border px-3 py-1 text-sm font-semibold transition', {
            'border-primary bg-primary text-white': page === pageNumber,
            'border-slate-200 bg-white text-slate-600 hover:border-primary/60 hover:text-primary': page !== pageNumber
          })}
          onClick={() => onChange(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}
    </div>
  );
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Pagination;
