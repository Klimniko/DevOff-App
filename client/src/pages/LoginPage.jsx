import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState } from 'react';

function LoginPage() {
  const { register, handleSubmit } = useForm();
  const { login, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [error, setError] = useState(null);

  if (isAuthenticated) {
    const redirectTo = location.state?.from?.pathname || '/';
    return <Navigate to={redirectTo} replace />;
  }

  const onSubmit = async (values) => {
    setError(null);
    try {
      await login(values);
      toast.success('Logged in successfully');
    } catch (err) {
      const message = err?.response?.data?.message || 'Invalid credentials';
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <img src="/logo.png" alt="Company logo" className="mx-auto h-16 w-16 rounded-full border border-primary" />
          <h1 className="mt-4 text-2xl font-semibold text-slate-800">DevOff Commission Portal</h1>
          <p className="text-sm text-slate-500">Sign in to manage project commissions</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="text-sm font-semibold text-slate-600">Username</label>
            <input
              type="text"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              {...register('username', { required: true })}
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              {...register('password', { required: true })}
              placeholder="Enter password"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-500">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300" {...register('rememberMe')} />
              Remember me
            </label>
            <span className="text-slate-400">Need help? Contact admin.</span>
          </div>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
