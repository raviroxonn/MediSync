import { useEffect, useState } from 'react';
import { useLocation, useNavigation } from 'react-router-dom';
import Box from '@mui/material/Box';
import LoadingIndicator from '../LoadingIndicator';

export default function RouteTransition() {
  const location = useLocation();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (navigation.state === 'loading') {
      setIsLoading(true);
    } else {
      // Add a small delay before hiding the loading indicator to prevent flashing
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [navigation.state]);

  // Also show loading indicator on location changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [location]);

  if (!isLoading) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: (theme) => theme.zIndex.drawer + 2,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
      }}
    >
      <LoadingIndicator />
    </Box>
  );
} 