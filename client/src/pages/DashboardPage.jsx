import { useEffect, useState } from 'react';
import { BanknotesIcon, ClipboardDocumentListIcon, TrophyIcon } from '@heroicons/react/24/outline';
import dashboardService from '../services/dashboardService';
import StatsCard from '../components/StatsCard';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getStats();
        setStats(data);
      } catch {
        toast.error('Unable to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading dashboard...</p>;
  }

  if (!stats) {
    return <p className="text-sm text-red-500">Dashboard data unavailable.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <StatsCard label="Total Commission" value={formatCurrency(stats.totalCommission || 0)} icon={BanknotesIcon} trend={`Average commission: ${formatCurrency(stats.averageCommission || 0)}`} />
        <StatsCard label="Projects" value={stats.totalProjects} icon={ClipboardDocumentListIcon} trend={`Last calculation ${stats.lastCalculation ? format(new Date(stats.lastCalculation.calculation_date), 'PPP') : 'N/A'}`} />
        <StatsCard label="Top Commission" value={formatCurrency(stats.topCommission?.commission_eur || 0)} icon={TrophyIcon} trend={stats.topCommission ? stats.topCommission.project_name : 'No data yet'} />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Recent Calculations</h2>
          <Link to="/calculations" className="text-sm font-semibold text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {stats.recent?.length ? (
            stats.recent.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item.project_name}</p>
                  <p className="text-xs text-slate-500">{format(new Date(item.calculation_date), 'PPP')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-600">{formatCurrency(item.commission_eur)}</p>
                  <p className="text-xs text-slate-500">Rate used: {item.exchange_rate.toFixed(4)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No calculations yet. Create your first calculation.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
