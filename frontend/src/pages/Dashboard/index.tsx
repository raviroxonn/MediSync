import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  IconButton,
  Button,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondary,
  Chip,
  LinearProgress,
  Stack,
  Badge,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  LocalHospital as HospitalIcon,
  DirectionsCar as AmbulanceIcon,
  Warning as EmergencyIcon,
  People as StaffIcon,
  AccessTime as TimeIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

// Custom styles
const styles = {
  gradientCard: {
    background: theme => `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    color: 'white',
    borderRadius: 2,
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },
  statsCard: {
    p: 3,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
    },
  },
  chart: {
    p: 3,
    height: '100%',
    minHeight: 400,
  },
};

interface EmergencyCase {
  id: number;
  title: string;
  location: string;
  severity: 'high' | 'medium' | 'low';
  time: string;
  status: 'active' | 'resolved';
  assignedTo: string;
}

interface StaffMember {
  id: number;
  name: string;
  role: string;
  status: 'active' | 'break' | 'off';
  avatar: string;
}

const mockEmergencies: EmergencyCase[] = [
  {
    id: 1,
    title: 'Traffic Accident',
    location: 'Main St & 5th Ave',
    severity: 'high',
    time: '10 min ago',
    status: 'active',
    assignedTo: 'Dr. Smith',
  },
  {
    id: 2,
    title: 'Cardiac Emergency',
    location: 'Central Hospital',
    severity: 'high',
    time: '15 min ago',
    status: 'active',
    assignedTo: 'Dr. Johnson',
  },
  {
    id: 3,
    title: 'Sports Injury',
    location: 'City Stadium',
    severity: 'medium',
    time: '30 min ago',
    status: 'resolved',
    assignedTo: 'Dr. Williams',
  },
];

const mockStaff: StaffMember[] = [
  {
    id: 1,
    name: 'Dr. Sarah Smith',
    role: 'Emergency Physician',
    status: 'active',
    avatar: 'S',
  },
  {
    id: 2,
    name: 'Dr. John Johnson',
    role: 'Trauma Surgeon',
    status: 'active',
    avatar: 'J',
  },
  {
    id: 3,
    name: 'Dr. Emily Williams',
    role: 'Cardiologist',
    status: 'break',
    avatar: 'E',
  },
];

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    activeEmergencies: 5,
    availableHospitals: 12,
    activeStaff: 45,
    averageResponseTime: 8,
    totalPatients: 128,
    occupancyRate: 75,
  });

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setStats(prev => ({
      ...prev,
      activeEmergencies: prev.activeEmergencies + Math.floor(Math.random() * 3) - 1,
      activeStaff: prev.activeStaff + Math.floor(Math.random() * 5) - 2,
      averageResponseTime: Math.max(5, prev.averageResponseTime + Math.floor(Math.random() * 2) - 1),
    }));
    setIsLoading(false);
  };

  useEffect(() => {
    const interval = setInterval(handleRefresh, 30000);
    return () => clearInterval(interval);
  }, []);

  // Chart data
  const responseTimeData = {
    labels: ['6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
    datasets: [
      {
        label: 'Response Time (minutes)',
        data: [9, 7, 8, 6, 8, 7, 6],
        fill: true,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const emergencyCaseData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Emergency Cases',
        data: [12, 19, 15, 17, 14, 15, 18],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Emergency Response Dashboard
        </Typography>
        <Tooltip title="Refresh data">
          <IconButton onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : <RefreshIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            title: 'Active Emergencies',
            value: stats.activeEmergencies,
            icon: <EmergencyIcon />,
            color: 'error.main',
            trend: '+12%',
            trendUp: true,
          },
          {
            title: 'Available Hospitals',
            value: stats.availableHospitals,
            icon: <HospitalIcon />,
            color: 'primary.main',
            trend: 'stable',
          },
          {
            title: 'Active Staff',
            value: stats.activeStaff,
            icon: <StaffIcon />,
            color: 'success.main',
            trend: '-5%',
            trendUp: false,
          },
          {
            title: 'Avg. Response Time',
            value: `${stats.averageResponseTime}m`,
            icon: <TimeIcon />,
            color: 'warning.main',
            trend: '-2%',
            trendUp: false,
          },
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={styles.statsCard}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: stat.color, mr: 2 }}>
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography color="textSecondary" variant="overline">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {stat.value}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {stat.trend === 'stable' ? (
                    <Chip 
                      label="Stable" 
                      size="small" 
                      color="default"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  ) : (
                    <Chip
                      icon={stat.trendUp ? <ArrowUpIcon /> : <ArrowDownIcon />}
                      label={stat.trend}
                      size="small"
                      color={stat.trendUp ? 'success' : 'error'}
                      sx={{ fontSize: '0.75rem' }}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={styles.chart}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Response Time Trend
            </Typography>
            <Line
              data={responseTimeData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      display: false,
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={styles.chart}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Emergency Cases by Day
            </Typography>
            <Bar
              data={emergencyCaseData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      display: false,
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Active Emergencies and Staff Status */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Active Emergencies
              </Typography>
              <Badge badgeContent={mockEmergencies.filter(e => e.status === 'active').length} color="error">
                <NotificationsIcon />
              </Badge>
            </Box>
            <List>
              {mockEmergencies.map((emergency) => (
                <ListItem
                  key={emergency.id}
                  sx={{
                    mb: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    boxShadow: 1,
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: emergency.severity === 'high' ? 'error.main' : 'warning.main' }}>
                      <EmergencyIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {emergency.title}
                        </Typography>
                        <Chip
                          label={emergency.status}
                          size="small"
                          color={emergency.status === 'active' ? 'error' : 'success'}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="textSecondary">
                          {emergency.location}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Assigned to: {emergency.assignedTo}
                        </Typography>
                      </>
                    }
                  />
                  <Typography variant="caption" color="textSecondary">
                    {emergency.time}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Staff Status
            </Typography>
            <List>
              {mockStaff.map((staff) => (
                <ListItem
                  key={staff.id}
                  sx={{
                    mb: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    boxShadow: 1,
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant="dot"
                      color={staff.status === 'active' ? 'success' : staff.status === 'break' ? 'warning' : 'error'}
                    >
                      <Avatar>{staff.avatar}</Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="bold">
                        {staff.name}
                      </Typography>
                    }
                    secondary={staff.role}
                  />
                  <Chip
                    label={staff.status}
                    size="small"
                    color={staff.status === 'active' ? 'success' : staff.status === 'break' ? 'warning' : 'error'}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* System Status */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
          System Status
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Hospital Occupancy</Typography>
                <Typography variant="body1" fontWeight="bold">{stats.occupancyRate}%</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={stats.occupancyRate}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'background.paper',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Total Patients Today</Typography>
                <Typography variant="body1" fontWeight="bold">{stats.totalPatients}</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(stats.totalPatients / 200) * 100}
                color="secondary"
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'background.paper',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
} 