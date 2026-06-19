import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from './routes';
import RootPage from '../pages/RootPage';
import DashboardPage from '../pages/manajer/DashboardPage';
import KapasitasPage from '../pages/manajer/KapasitasPage';
import RequestPickupPage from '../pages/manajer/RequestPickupPage';

export const router = createBrowserRouter([
  {
    path: ROUTES.ROOT,
    element: <RootPage />,
  },
  {
    path: ROUTES.MANAJER_DASHBOARD,
    element: <DashboardPage />,
  },
  {
    path: ROUTES.MANAJER_KAPASITAS,
    element: <KapasitasPage />,
  },
  {
    path: ROUTES.MANAJER_PICKUP_REQUEST,
    element: <RequestPickupPage />,
  },
]);
