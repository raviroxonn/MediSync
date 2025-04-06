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
  Menu,
  MenuItem,
  Tab,
  Tabs,
  useTheme,
  alpha,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  AvatarGroup,
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
  LocationOn as LocationIcon,
  LocalShipping as TransferIcon,
  Speed as SpeedIcon,
  Assessment as AssessmentIcon,
  Bed as BedIcon,
  LocalHotel as BedsIcon,
  MedicalServices as MedicalIcon,
  LocalPharmacy as PharmacyIcon,
  Timeline as TimelineIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  DirectionsRun,
} from '@mui/icons-material';
import { useState, useEffect, useCallback, useTransition, Suspense, useMemo } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';
import { motion, AnimatePresence, Variants, useReducedMotion } from 'framer-motion';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import { useNotification } from '../../contexts/NotificationContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

// Animation variants - simplified for better performance
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "tween",
      duration: 0.2
    }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "tween",
      duration: 0.2
    }
  },
  hover: {
    y: -5,
    transition: {
      type: "tween",
      duration: 0.2
    }
  }
};

const chartVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2
    }
  }
};

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
  resourceCard: {
    p: 2,
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    mb: 2,
  },
};

interface EmergencyAlert {
  id: string;
  type: string;
  location: string;
  timestamp: string;
  severity: 'critical' | 'moderate' | 'stable';
  status: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'standby' | 'offline';
  avatar: string;
}

const mockAlerts: EmergencyAlert[] = [
  {
    id: '1',
    type: 'Cardiac Emergency',
    location: 'Central Hospital, Floor 3',
    timestamp: '2 mins ago',
    severity: 'critical',
    status: 'Active Response',
  },
  {
    id: '2',
    type: 'Traffic Accident',
    location: 'Main St & 5th Ave',
    timestamp: '5 mins ago',
    severity: 'moderate',
    status: 'En Route',
  },
  {
    id: '3',
    type: 'Medical Emergency',
    location: 'Downtown Clinic',
    timestamp: '10 mins ago',
    severity: 'stable',
    status: 'Resolved',
  },
];

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    role: 'Emergency Physician',
    status: 'active',
    avatar: '/avatars/1.jpg',
  },
  {
    id: '2',
    name: 'James Wilson',
    role: 'Paramedic',
    status: 'active',
    avatar: '/avatars/2.jpg',
  },
  {
    id: '3',
    name: 'Emma Thompson',
    role: 'Emergency Nurse',
    status: 'standby',
    avatar: '/avatars/3.jpg',
  },
];

const Dashboard = () => {
  const theme = useTheme();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const { notifications, showNotification } = useNotification();
  const notificationCount = notifications.length;
  const shouldReduceMotion = useReducedMotion();
  const [stats, setStats] = useState({
    activeEmergencies: 12,
    availableTeams: 8,
    avgResponseTime: 4.5,
    successRate: 94,
    totalPatients: 156,
    criticalCases: 23,
  });

  const [timeRange, setTimeRange] = useState('24h');

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      startTransition(() => {
        setStats(prev => ({
          ...prev,
          activeEmergencies: prev.activeEmergencies + Math.floor(Math.random() * 3) - 1,
          availableTeams: prev.availableTeams + Math.floor(Math.random() * 2) - 1,
          avgResponseTime: Number((prev.avgResponseTime + (Math.random() * 0.4 - 0.2)).toFixed(1)),
          successRate: Math.min(100, Math.max(0, prev.successRate + Math.floor(Math.random() * 3) - 1)),
          totalPatients: prev.totalPatients + Math.floor(Math.random() * 5),
          criticalCases: Math.max(0, prev.criticalCases + Math.floor(Math.random() * 3) - 1),
        }));
      });
    } finally {
      setIsLoading(false);
    }
  }, [startTransition]);

  const handleTimeRangeChange = (range: string) => {
    startTransition(() => {
      setTimeRange(range);
    });
  };

  useEffect(() => {
    const interval = setInterval(handleRefresh, 30000);
    return () => clearInterval(interval);
  }, [handleRefresh]);

  const responseTimeData = useMemo(() => ({
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [
      {
        label: 'Response Time (mins)',
        data: [5.2, 4.8, 6.1, 4.3, 5.9, 4.5],
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        fill: true,
        tension: 0.4,
      },
    ],
  }), [theme.palette.primary.main]);

  const emergencyTypeData = useMemo(() => ({
    labels: ['Cardiac', 'Trauma', 'Respiratory', 'Neurological', 'Other'],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          theme.palette.error.main,
          theme.palette.warning.main,
          theme.palette.info.main,
          theme.palette.success.main,
          theme.palette.grey[500],
        ],
        borderWidth: 0,
      },
    ],
  }), [theme.palette.error.main, theme.palette.warning.main, theme.palette.info.main, theme.palette.success.main, theme.palette.grey]);

  const handleNotificationClick = () => {
    showNotification(
      'You have ' + notificationCount + ' active notifications',
      'info',
      'Notification Center'
    );
  };
  
  // Skip animations if reduced motion is preferred
  const getAnimationProps = () => {
    if (shouldReduceMotion) {
      return {
        initial: undefined,
        animate: undefined,
        transition: undefined,
        variants: undefined,
        whileHover: undefined,
      };
    }
    return {};
  };

  return (
    <Box
      component={motion.div}
      {...(shouldReduceMotion ? {} : {
        variants: containerVariants,
        initial: "hidden",
        animate: "visible"
      })}
      className="gpu-accelerated"
      sx={{
        p: 3,
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.background.default, 0.95)} 100%)`,
        overflow: 'hidden',
      }}
    >
      <Stack 
        component={motion.div}
        {...(shouldReduceMotion ? {} : { variants: itemVariants })}
        direction="row" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={3}
      >
        <Typography 
          component={motion.h1}
          {...(shouldReduceMotion ? {} : {
            initial: { opacity: 0, x: -10 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.2 }
          })}
          variant="h4" 
          fontWeight="bold" 
          color="primary"
        >
          Emergency Response Dashboard
        </Typography>
        <Stack 
          component={motion.div}
          {...(shouldReduceMotion ? {} : {
            initial: { opacity: 0, x: 10 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.2 }
          })}
          direction="row" 
          spacing={2} 
          alignItems="center"
        >
          <Tooltip title="Notifications">
            <IconButton 
              component={motion.button}
              {...(shouldReduceMotion ? {} : {
                whileHover: { scale: 1.1 },
                whileTap: { scale: 0.95 }
              })}
              onClick={handleNotificationClick}
              color="primary"
            >
              <Badge 
                badgeContent={notificationCount} 
                color="error"
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh Data">
            <IconButton 
              component={motion.button}
              {...(shouldReduceMotion ? {} : {
                whileHover: { scale: 1.1 },
                whileTap: { scale: 0.95 }
              })}
              onClick={handleRefresh} 
              color="primary"
              disabled={isLoading || isPending}
            >
              {(isLoading || isPending) ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <RefreshIcon />
              )}
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        <Suspense fallback={
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress />
          </Box>
        }>
          {/* Stats Cards */}
          <Grid item xs={12} sm={6} md={3} component={motion.div} 
            {...(shouldReduceMotion ? {} : { variants: itemVariants })}
          >
            <motion.div 
              {...(shouldReduceMotion ? {} : {
                whileHover: "hover",
                variants: cardVariants
              })}
            >
              <StatCard
                title="Active Emergencies"
                value={stats.activeEmergencies}
                icon={<EmergencyIcon />}
                color="error"
                trend={{ value: 8, isPositive: false }}
                loading={isPending}
              />
            </motion.div>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3} component={motion.div} 
            {...(shouldReduceMotion ? {} : { variants: itemVariants })}
          >
            <motion.div 
              {...(shouldReduceMotion ? {} : {
                whileHover: "hover",
                variants: cardVariants
              })}
            >
              <StatCard
                title="Available Teams"
                value={stats.availableTeams}
                icon={<DirectionsRun />}
                color="success"
                trend={{ value: 2, isPositive: true }}
                loading={isPending}
              />
            </motion.div>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3} component={motion.div} 
            {...(shouldReduceMotion ? {} : { variants: itemVariants })}
          >
            <motion.div 
              {...(shouldReduceMotion ? {} : {
                whileHover: "hover",
                variants: cardVariants
              })}
            >
              <StatCard
                title="Avg. Response Time"
                value={`${stats.avgResponseTime}m`}
                icon={<TimeIcon />}
                color="warning"
                trend={{ value: 12, isPositive: true }}
                loading={isPending}
              />
            </motion.div>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3} component={motion.div} 
            {...(shouldReduceMotion ? {} : { variants: itemVariants })}
          >
            <motion.div 
              {...(shouldReduceMotion ? {} : {
                whileHover: "hover",
                variants: cardVariants
              })}
            >
              <StatCard
                title="Success Rate"
                value={`${stats.successRate}%`}
                icon={<CheckCircleIcon />}
                color="info"
                trend={{ value: 5, isPositive: true }}
                loading={isPending}
              />
            </motion.div>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={8} component={motion.div} 
            {...(shouldReduceMotion ? {} : { variants: itemVariants })}
          >
            <Card
              component={motion.div}
              {...(shouldReduceMotion ? {} : {
                variants: cardVariants,
                initial: "hidden",
                animate: "visible",
                whileHover: "hover"
              })}
              sx={{
                p: 3,
                height: '100%',
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                overflow: 'hidden',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Response Time Trends</Typography>
                <Stack direction="row" spacing={1}>
                  {['24h', '7d', '30d'].map((range, index) => (
                    <motion.div
                      key={range}
                      {...(shouldReduceMotion ? {} : {
                        initial: { opacity: 0, y: -5 },
                        animate: { opacity: 1, y: 0 },
                        transition: { delay: 0.05 * index, duration: 0.2 }
                      })}
                    >
                      <Button
                        size="small"
                        variant={timeRange === range ? 'contained' : 'outlined'}
                        onClick={() => handleTimeRangeChange(range)}
                        disabled={isPending}
                      >
                        {range}
                      </Button>
                    </motion.div>
                  ))}
                </Stack>
              </Stack>
              <Box sx={{ height: 300, position: 'relative' }}>
                {isPending && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'rgba(255, 255, 255, 0.7)',
                      zIndex: 1,
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}
                <motion.div
                  {...(shouldReduceMotion ? {} : {
                    variants: chartVariants,
                    initial: "hidden",
                    animate: "visible"
                  })}
                  style={{ height: '100%' }}
                >
                  <Line
                    data={responseTimeData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            display: true,
                            color: alpha(theme.palette.divider, 0.1),
                          },
                        },
                        x: {
                          grid: {
                            display: false,
                          },
                        },
                      },
                      animation: {
                        duration: shouldReduceMotion ? 0 : 1000,
                      },
                    }}
                  />
                </motion.div>
              </Box>
            </Card>
          </Grid>

          {/* Emergency Types */}
          <Grid item xs={12} md={4} component={motion.div} 
            {...(shouldReduceMotion ? {} : { variants: itemVariants })}
          >
            <Card
              component={motion.div}
              {...(shouldReduceMotion ? {} : {
                variants: cardVariants,
                initial: "hidden",
                animate: "visible",
                whileHover: "hover"
              })}
              sx={{
                p: 3,
                height: '100%',
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Typography variant="h6" mb={3}>Emergency Distribution</Typography>
              {isPending && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(255, 255, 255, 0.7)',
                    zIndex: 1,
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                <motion.div
                  {...(shouldReduceMotion ? {} : {
                    variants: chartVariants,
                    initial: "hidden",
                    animate: "visible"
                  })}
                  style={{ height: '100%', width: '100%' }}
                >
                  <Doughnut
                    data={emergencyTypeData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        },
                      },
                      animation: {
                        animateRotate: !shouldReduceMotion,
                        animateScale: !shouldReduceMotion,
                        duration: shouldReduceMotion ? 0 : 1000,
                      },
                    }}
                  />
                </motion.div>
              </Box>
            </Card>
          </Grid>

          {/* Recent Alerts */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 3,
                height: '100%',
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <Typography variant="h6" mb={2}>Recent Alerts</Typography>
              <List>
                {mockAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    {...(shouldReduceMotion ? {} : {
                      initial: { opacity: 0, x: -10 },
                      animate: { opacity: 1, x: 0 },
                      transition: { delay: index * 0.05, duration: 0.2 }
                    })}
                  >
                    <ListItem
                      sx={{
                        mb: 2,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        opacity: isPending ? 0.7 : 1,
                        transition: 'opacity 0.2s',
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: alpha(
                              theme.palette[alert.severity === 'critical' ? 'error' : alert.severity === 'moderate' ? 'warning' : 'success'].main,
                              0.2
                            ),
                            color: theme.palette[alert.severity === 'critical' ? 'error' : alert.severity === 'moderate' ? 'warning' : 'success'].main,
                          }}
                        >
                          <EmergencyIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" component="span">
                            {alert.type}
                          </Typography>
                        }
                        secondary={
                          <Stack 
                            direction="row" 
                            alignItems="center" 
                            spacing={1} 
                            component="span"
                          >
                            <LocationIcon sx={{ fontSize: 14 }} />
                            <Typography variant="body2" component="span">
                              {alert.location}
                            </Typography>
                            <Typography variant="caption" component="span" color="text.secondary">
                              • {alert.timestamp}
                            </Typography>
                          </Stack>
                        }
                      />
                      <StatusBadge status={alert.severity} />
                    </ListItem>
                  </motion.div>
                ))}
              </List>
            </Card>
          </Grid>

          {/* Active Teams */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 3,
                height: '100%',
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Active Teams</Typography>
                <AvatarGroup max={4}>
                  {mockTeamMembers.map((member) => (
                    <Tooltip key={member.id} title={`${member.name} - ${member.role}`}>
                      <Avatar
                        src={member.avatar}
                        sx={{
                          border: `2px solid ${theme.palette[member.status === 'active' ? 'success' : member.status === 'standby' ? 'warning' : 'error'].main}`,
                          opacity: isPending ? 0.7 : 1,
                          transition: 'opacity 0.2s',
                        }}
                      />
                    </Tooltip>
                  ))}
                </AvatarGroup>
              </Stack>
              <List>
                {mockTeamMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    {...(shouldReduceMotion ? {} : {
                      initial: { opacity: 0, x: -10 },
                      animate: { opacity: 1, x: 0 },
                      transition: { delay: index * 0.05, duration: 0.2 }
                    })}
                  >
                    <ListItem
                      sx={{
                        mb: 2,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        opacity: isPending ? 0.7 : 1,
                        transition: 'opacity 0.2s',
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar src={member.avatar} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" component="span">
                            {member.name}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" component="span" color="text.secondary">
                            {member.role}
                          </Typography>
                        }
                      />
                      <Chip
                        label={member.status}
                        size="small"
                        color={member.status === 'active' ? 'success' : member.status === 'standby' ? 'warning' : 'error'}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </ListItem>
                  </motion.div>
                ))}
              </List>
            </Card>
          </Grid>
        </Suspense>
      </Grid>
    </Box>
  );
};

export default Dashboard; 