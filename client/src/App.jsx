import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NewCalculationPage from './pages/NewCalculationPage';
import CalculationsListPage from './pages/CalculationsListPage';
import CalculationDetailsPage from './pages/CalculationDetailsPage';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={(
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={<DashboardPage />} />
          <Route path="/calculations/new" element={<NewCalculationPage />} />
          <Route path="/calculations" element={<CalculationsListPage />} />
          <Route path="/calculations/:id" element={<CalculationDetailsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar closeOnClick />
    </>
  );
}

export default App;
