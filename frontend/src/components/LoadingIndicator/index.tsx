import { Box, CircularProgress, LinearProgress } from '@mui/material';

interface LoadingIndicatorProps {
  type?: 'linear' | 'circular';
  fullscreen?: boolean;
}

export default function LoadingIndicator({ type = 'linear', fullscreen = false }: LoadingIndicatorProps) {
  if (fullscreen) {
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
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 9999,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      {type === 'linear' ? (
        <LinearProgress
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
          }}
        />
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            p: 3,
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
} 