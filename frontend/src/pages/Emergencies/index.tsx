import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  LinearProgress,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  Warning as WarningIcon,
  LocalHospital as HospitalIcon,
  DirectionsCar as AmbulanceIcon,
  AccessTime as TimeIcon,
  Add as AddIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useState } from 'react';

interface Emergency {
  id: number;
  type: string;
  location: string;
  status: 'critical' | 'stable' | 'en-route';
  timeReported: string;
  assignedHospital?: string;
  assignedAmbulance?: string;
  description: string;
  eta?: string;
  severity: 'High' | 'Medium' | 'Low';
  progress: number;
}

// Mock data - In a real app, this would come from an API
const emergencies: Emergency[] = [
  {
    id: 1,
    type: 'Traffic Accident',
    location: 'Interstate 95, Mile Marker 42',
    status: 'critical',
    timeReported: '10:30 AM',
    assignedHospital: 'Central Hospital',
    assignedAmbulance: 'Unit 7',
    description: 'Multi-vehicle collision, multiple injuries reported',
    eta: '5 mins',
    severity: 'High',
    progress: 75,
  },
  {
    id: 2,
    type: 'Cardiac Emergency',
    location: '234 Pine Street',
    status: 'en-route',
    timeReported: '10:45 AM',
    assignedHospital: "St. Mary's Medical Center",
    assignedAmbulance: 'Unit 3',
    description: 'Possible heart attack, elderly patient',
    eta: '8 mins',
    severity: 'High',
    progress: 45,
  },
  {
    id: 3,
    type: 'Workplace Injury',
    location: 'Construction Site, 567 Main St',
    status: 'stable',
    timeReported: '11:15 AM',
    assignedHospital: 'Community Health Center',
    assignedAmbulance: 'Unit 5',
    description: 'Fall from height, conscious but injured',
    eta: '12 mins',
    severity: 'Medium',
    progress: 30,
  },
];

export default function Emergencies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredEmergencies = emergencies.filter((emergency) => {
    const matchesSearch = emergency.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emergency.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || emergency.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Emergency['status']) => {
    switch (status) {
      case 'critical':
        return 'error';
      case 'stable':
        return 'success';
      case 'en-route':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Emergency Cases
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          New Emergency
        </Button>
      </Box>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search emergencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Status Filter</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status Filter"
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
              <MenuItem value="stable">Stable</MenuItem>
              <MenuItem value="en-route">En Route</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Emergency Cards */}
      <Grid container spacing={3}>
        {filteredEmergencies.map((emergency) => (
          <Grid item xs={12} md={6} lg={4} key={emergency.id}>
            <Card
              sx={{
                position: 'relative',
                overflow: 'visible',
              }}
            >
              {emergency.status === 'critical' && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -12,
                    right: 16,
                    backgroundColor: 'error.main',
                    color: 'white',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': {
                        boxShadow: '0 0 0 0 rgba(255, 0, 0, 0.4)',
                      },
                      '70%': {
                        boxShadow: '0 0 0 10px rgba(255, 0, 0, 0)',
                      },
                      '100%': {
                        boxShadow: '0 0 0 0 rgba(255, 0, 0, 0)',
                      },
                    },
                  }}
                >
                  <WarningIcon fontSize="small" />
                </Box>
              )}
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {emergency.type}
                  </Typography>
                  <Chip
                    label={emergency.status.toUpperCase()}
                    color={getStatusColor(emergency.status)}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={emergency.severity}
                    color={emergency.severity === 'High' ? 'error' : emergency.severity === 'Medium' ? 'warning' : 'success'}
                    size="small"
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <LocationIcon color="action" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    {emergency.location}
                  </Typography>
                </Box>

                <Typography color="text.secondary" paragraph>
                  {emergency.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <TimeIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      Reported: {emergency.timeReported}
                      {emergency.eta && ` (ETA: ${emergency.eta})`}
                    </Typography>
                  </Box>

                  {emergency.assignedHospital && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <HospitalIcon fontSize="small" color="primary" />
                      <Typography variant="body2">{emergency.assignedHospital}</Typography>
                    </Box>
                  )}

                  {emergency.assignedAmbulance && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AmbulanceIcon fontSize="small" color="primary" />
                      <Typography variant="body2">{emergency.assignedAmbulance}</Typography>
                    </Box>
                  )}
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={emergency.progress}
                    color={getStatusColor(emergency.status)}
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Update Status
                </Button>
                <Button size="small" color="primary">
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 