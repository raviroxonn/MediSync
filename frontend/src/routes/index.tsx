import { lazy } from 'react';
import { Route } from 'react-router-dom';

// Lazy load components
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Hospitals = lazy(() => import('../pages/Hospitals'));
const Emergencies = lazy(() => import('../pages/Emergencies'));
const Staff = lazy(() => import('../pages/Staff'));
const Settings = lazy(() => import('../pages/Settings'));

const routes = (
  <>
    <Route index element={<Dashboard />} />
    <Route path="hospitals" element={<Hospitals />} />
    <Route path="emergencies" element={<Emergencies />} />
    <Route path="staff" element={<Staff />} />
    <Route path="settings" element={<Settings />} />
  </>
);

export default routes; 