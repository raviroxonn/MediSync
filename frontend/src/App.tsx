import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoadingIndicator from './components/common/LoadingIndicator';
import Layout from './components/Layout';
import { motion } from 'framer-motion';

// Animation variants for page transitions
const pageVariants = {
  initial: {
    opacity: 0,
    y: 10
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -10
  }
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3
};

// Lazy load Auth components
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/Auth/ResetPassword'));

// Lazy load main pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Hospitals = lazy(() => import('./pages/Hospitals'));
const Emergencies = lazy(() => import('./pages/Emergencies'));
const Patients = lazy(() => import('./pages/Patients'));
const Staff = lazy(() => import('./pages/Staff'));
const Settings = lazy(() => import('./pages/Settings'));

// Simple error boundary component
const ErrorPage = () => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    style={{ 
      padding: '2rem', 
      maxWidth: '600px', 
      margin: '0 auto', 
      textAlign: 'center'
    }}
  >
    <h1>Page Not Found</h1>
    <p>Sorry, the page you are looking for does not exist.</p>
    <a href="/" style={{ color: '#3f51b5', textDecoration: 'none' }}>
      Return to Home
    </a>
  </motion.div>
);

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingIndicator />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  
  return <>{children}</>;
};

// Auth route component
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingIndicator />;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Auth layout component
const AuthLayout = () => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    style={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}
  >
    <Outlet />
  </motion.div>
);

// SuspenseWrapper for lazy-loaded components with animations
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingIndicator />}>
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  </Suspense>
);

// Configure the router
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/auth/login" replace />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/auth',
    element: (
      <AuthProvider>
        <AuthRoute>
          <AuthLayout />
        </AuthRoute>
      </AuthProvider>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" replace />
      },
      {
        path: 'login',
        element: <SuspenseWrapper><Login /></SuspenseWrapper>
      },
      {
        path: 'register',
        element: <SuspenseWrapper><Register /></SuspenseWrapper>
      },
      {
        path: 'forgot-password',
        element: <SuspenseWrapper><ForgotPassword /></SuspenseWrapper>
      },
      {
        path: 'reset-password',
        element: <SuspenseWrapper><ResetPassword /></SuspenseWrapper>
      }
    ]
  },
  {
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      </AuthProvider>
    ),
    children: [
      {
        path: 'dashboard',
        element: <SuspenseWrapper><Dashboard /></SuspenseWrapper>
      },
      {
        path: 'hospitals',
        element: <SuspenseWrapper><Hospitals /></SuspenseWrapper>
      },
      {
        path: 'emergencies',
        element: <SuspenseWrapper><Emergencies /></SuspenseWrapper>
      },
      {
        path: 'patients',
        element: <SuspenseWrapper><Patients /></SuspenseWrapper>
      },
      {
        path: 'staff',
        element: <SuspenseWrapper><Staff /></SuspenseWrapper>
      },
      {
        path: 'settings',
        element: <SuspenseWrapper><Settings /></SuspenseWrapper>
      }
    ]
  },
  {
    path: '*',
    element: <ErrorPage />
  }
]);

const App = () => {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <RouterProvider router={router} fallbackElement={<LoadingIndicator />} />
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;
