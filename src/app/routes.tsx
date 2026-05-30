import { createBrowserRouter, Navigate } from 'react-router';
import { AppShell } from './components/AppShell';
import Auth from './pages/Auth';
import Landing from './pages/Landing';
import Home from './pages/Home';
import MyTools from './pages/MyTools';
import ToolDetail from './pages/ToolDetail';
import Scan from './pages/Scan';
import Support from './pages/Support';
import Profile from './pages/Profile';
import ReceiptVault from './pages/ReceiptVault';
import ServiceLocator from './pages/ServiceLocator';
import DailyTips from './pages/DailyTips';

// ── Distributor Portal ────────────────────────────────────────────
import { DistributorShell } from '../distributor/components/DistributorShell';
import DistributorAuth from '../distributor/pages/DistributorAuth';
import Dashboard from '../distributor/pages/Dashboard';
import Customers from '../distributor/pages/Customers';
import Claims from '../distributor/pages/Claims';
import Catalog from '../distributor/pages/Catalog';
import Analytics from '../distributor/pages/Analytics';
import MediaHub from '../distributor/pages/MediaHub';
import WebOrders from '../distributor/pages/WebOrders';
import WebDistributors from '../distributor/pages/WebDistributors';
import UnderConstruction from './pages/UnderConstruction';
import BeiterXLanding from './pages/BeiterXLanding';
import SetupGuide from './pages/SetupGuide';
import ChooseStore from './pages/ChooseStore';

export const router = createBrowserRouter([
  // ── BeiterX Landing Page (main) ─────────────────────────────────
  {
    path: '/',
    element: <BeiterXLanding />,
  },

  // ── App Store chooser (middleware fallback for undetected devices) ─
  {
    path: '/choose-store',
    element: <ChooseStore />,
  },

  // ── Google Sheets Setup Guide ────────────────────────────────────
  {
    path: '/setup',
    element: <SetupGuide />,
  },

  // ── Original Landing Page ───────────────────────────────────────
  {
    path: '/ecosystem',
    element: <Landing />,
  },

  // ── End-User App ──────────────────────────────────────────────
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/app',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="home" replace /> },
      { path: 'home',            element: <Home /> },
      { path: 'tools',           element: <MyTools /> },
      { path: 'tools/:id',       element: <ToolDetail /> },
      { path: 'scan',            element: <Scan /> },
      { path: 'support',         element: <Support /> },
      { path: 'profile',         element: <Profile /> },
      { path: 'receipts',        element: <ReceiptVault /> },
      { path: 'service-locator', element: <ServiceLocator /> },
      { path: 'tips',            element: <DailyTips /> },
    ],
  },

  // ── Distributor Portal ────────────────────────────────────────
  {
    path: '/dist/auth',
    element: <UnderConstruction />,
  },
  {
    path: '/dist',
    element: <UnderConstruction />,
  },
  {
    path: '/dist/*',
    element: <UnderConstruction />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);