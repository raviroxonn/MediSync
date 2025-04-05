import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  CircularProgress,
  Tooltip,
  Alert,
  Snackbar,
  LinearProgress,
  Stack,
  Divider,
  Avatar,
  Badge,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  Skeleton,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocalHospital as HospitalIcon,
  Phone as PhoneIcon,
  DirectionsCar as AmbulanceIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Map as MapIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  GetApp as DownloadIcon,
  Notifications as NotificationsIcon,
  LocationOn as LocationIcon,
  DarkMode as DarkModeIcon,
  GridView as Grid4x4Icon,
  TableChart as TableChartIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface Hospital {
  id: number;
  name: string;
  address: string;
  phone: string;
  availableBeds: number;
  emergencyCapacity: boolean;
  ambulanceCount: number;
  specialties: string[];
  coordinates?: { lat: number; lng: number };
}

// Mock data - In a real app, this would come from an API
const initialHospitals: Hospital[] = [
  {
    id: 1,
    name: 'Central Hospital',
    address: '123 Main St, City',
    phone: '(555) 123-4567',
    availableBeds: 15,
    emergencyCapacity: true,
    ambulanceCount: 5,
    specialties: ['Trauma', 'Cardiac', 'Neurology'],
    coordinates: { lat: 37.7749, lng: -122.4194 },
  },
  {
    id: 2,
    name: "St. Mary's Medical Center",
    address: '456 Park Ave, City',
    phone: '(555) 234-5678',
    availableBeds: 8,
    emergencyCapacity: true,
    ambulanceCount: 3,
    specialties: ['Pediatrics', 'Orthopedics'],
    coordinates: { lat: 37.7848, lng: -122.4294 },
  },
  {
    id: 3,
    name: 'Community Health Center',
    address: '789 Oak Rd, City',
    phone: '(555) 345-6789',
    availableBeds: 3,
    emergencyCapacity: false,
    ambulanceCount: 1,
    specialties: ['General Care', 'Family Medicine'],
    coordinates: { lat: 37.7947, lng: -122.4394 },
  },
];

const specialtyOptions = [
  'Trauma',
  'Cardiac',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'General Care',
  'Family Medicine',
];

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Add custom styles
const styles = {
  headerPaper: {
    p: 4,
    mb: 4,
    background: theme => `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    color: 'white',
    borderRadius: 3,
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },
  statsCard: {
    bgcolor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
    },
  },
  filterPaper: {
    p: 3,
    mb: 4,
    borderRadius: 2,
    border: theme => `1px solid ${theme.palette.divider}`,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  hospitalCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 2,
    border: theme => `1px solid ${theme.palette.divider}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
    },
  },
  tableContainer: {
    borderRadius: 2,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    '& .MuiTableCell-head': {
      fontWeight: 'bold',
      backgroundColor: theme => theme.palette.primary.main,
      color: 'white',
    },
    '& .MuiTableRow-root:hover': {
      backgroundColor: 'rgba(0,0,0,0.04)',
    },
  },
  speedDial: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    '& .MuiFab-primary': {
      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    },
  },
};

export default function Hospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>(initialHospitals);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [currentTab, setCurrentTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showQuickStats, setShowQuickStats] = useState(true);

  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || hospital.specialties.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  // Calculate quick stats
  const totalBeds = hospitals.reduce((sum, h) => sum + h.availableBeds, 0);
  const totalAmbulances = hospitals.reduce((sum, h) => sum + h.ambulanceCount, 0);
  const emergencyCapableCount = hospitals.filter(h => h.emergencyCapacity).length;

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Update with random variations
    setHospitals(prev => prev.map(hospital => ({
      ...hospital,
      availableBeds: Math.max(0, hospital.availableBeds + Math.floor(Math.random() * 3) - 1),
      ambulanceCount: Math.max(0, hospital.ambulanceCount + Math.floor(Math.random() * 2) - 1),
    })));
    setIsLoading(false);
  };

  const handleEdit = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setOpenDialog(true);
  };

  const handleDelete = (hospitalId: number) => {
    setHospitals(prev => prev.filter(h => h.id !== hospitalId));
    setSnackbar({
      open: true,
      message: 'Hospital deleted successfully',
      severity: 'success',
    });
  };

  const handleSave = () => {
    if (selectedHospital) {
      setHospitals(prev => prev.map(h => h.id === selectedHospital.id ? selectedHospital : h));
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: 'Hospital updated successfully',
        severity: 'success',
      });
    }
  };

  useEffect(() => {
    // Auto-refresh every minute
    const interval = setInterval(handleRefresh, 60000);
    return () => clearInterval(interval);
  }, []);

  // Remove Google Maps specific styles and center
  const mapCenter: [number, number] = [37.7749, -122.4194];

  const quickActions = [
    { icon: <PrintIcon />, name: 'Print', action: () => window.print() },
    { icon: <ShareIcon />, name: 'Share', action: () => navigator.share?.({ title: 'Hospital Network', url: window.location.href }) },
    { icon: <DownloadIcon />, name: 'Export', action: () => console.log('Export data') },
  ];

  return (
    <Box sx={{ position: 'relative', pb: 8 }}>
      {/* Header with Quick Stats */}
      <Paper elevation={0} sx={styles.headerPaper}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <Typography 
            variant="h3" 
            fontWeight="800" 
            sx={{ 
              mb: 1,
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
              letterSpacing: '-0.5px',
            }}
          >
            Hospital Network
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControlLabel
              control={
                <Switch
                  checked={isDarkMode}
                  onChange={(e) => setIsDarkMode(e.target.checked)}
                  color="default"
                  sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'white' } }}
                />
              }
              label={<DarkModeIcon />}
            />
            <Tooltip title="Refresh data">
              <IconButton 
                onClick={handleRefresh} 
                disabled={isLoading} 
                sx={{ 
                  color: 'white',
                  backdropFilter: 'blur(4px)',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : <RefreshIcon />}
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {showQuickStats && (
          <Grid container spacing={3}>
            {[
              { title: 'Total Available Beds', value: totalBeds, max: hospitals.length * 20, icon: <HospitalIcon /> },
              { title: 'Active Ambulances', value: totalAmbulances, max: hospitals.length * 5, icon: <AmbulanceIcon /> },
              { title: 'Emergency Capable', value: emergencyCapableCount, max: hospitals.length, icon: <NotificationsIcon /> },
              { title: 'Total Facilities', value: hospitals.length, showAvatars: true, icon: <LocationIcon /> },
            ].map((stat, index) => (
              <Grid item xs={12} md={3} key={index}>
                <Card sx={styles.statsCard}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Box sx={{ 
                        p: 1, 
                        borderRadius: 1, 
                        bgcolor: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                      }}>
                        {stat.icon}
                      </Box>
                      <Typography color="inherit" variant="overline" fontWeight="bold">
                        {stat.title}
                      </Typography>
                    </Box>
                    <Typography variant="h3" color="inherit" fontWeight="bold" sx={{ mb: 2 }}>
                      {isLoading ? <Skeleton width={60} /> : stat.value}
                    </Typography>
                    {!stat.showAvatars ? (
                      <LinearProgress 
                        variant="determinate" 
                        value={(stat.value / stat.max) * 100}
                        sx={{ 
                          mt: 1, 
                          height: 6,
                          borderRadius: 3,
                          bgcolor: 'rgba(255,255,255,0.2)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                            bgcolor: 'rgba(255,255,255,0.8)',
                          },
                        }}
                      />
                    ) : (
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                        {hospitals.slice(0, 3).map((hospital) => (
                          <Avatar
                            key={hospital.id}
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              fontSize: '0.875rem',
                              fontWeight: 'bold',
                              bgcolor: 'rgba(255,255,255,0.2)',
                              border: '2px solid rgba(255,255,255,0.3)',
                            }}
                          >
                            {hospital.name[0]}
                          </Avatar>
                        ))}
                        {hospitals.length > 3 && (
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              fontSize: '0.875rem',
                              fontWeight: 'bold',
                              bgcolor: 'rgba(255,255,255,0.2)',
                              border: '2px solid rgba(255,255,255,0.3)',
                            }}
                          >
                            +{hospitals.length - 3}
                          </Avatar>
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Filters Section */}
      <Paper sx={styles.filterPaper}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search hospitals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderWidth: 2,
                  },
                  '&:hover fieldset': {
                    borderWidth: 2,
                  },
                  '&.Mui-focused fieldset': {
                    borderWidth: 2,
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Filter by Specialty</InputLabel>
              <Select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                label="Filter by Specialty"
                startAdornment={
                  <InputAdornment position="start">
                    <FilterIcon />
                  </InputAdornment>
                }
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderWidth: 2,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderWidth: 2,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderWidth: 2,
                  },
                }}
              >
                <MenuItem value="all">All Specialties</MenuItem>
                {specialtyOptions.map((specialty) => (
                  <MenuItem key={specialty} value={specialty}>
                    {specialty}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => {
                setSelectedHospital(null);
                setOpenDialog(true);
              }}
              sx={{
                py: 1.5,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                },
              }}
            >
              Add Hospital
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* View Tabs */}
      <Paper sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Tabs 
          value={currentTab} 
          onChange={(_, newValue) => setCurrentTab(newValue)}
          variant="fullWidth"
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root': {
              py: 2,
              fontSize: '1rem',
              fontWeight: 'medium',
            },
          }}
        >
          <Tab 
            label="Card View" 
            icon={<Grid4x4Icon />} 
            iconPosition="start"
          />
          <Tab 
            label="Table View" 
            icon={<TableChartIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Map View" 
            icon={<MapIcon />} 
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Card View */}
      {currentTab === 0 && (
        <Grid container spacing={3}>
          {filteredHospitals.map((hospital) => (
            <Grid item xs={12} md={6} lg={4} key={hospital.id}>
              <Card sx={styles.hospitalCard}>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h5" fontWeight="bold">{hospital.name}</Typography>
                    <Box>
                      <IconButton 
                        size="small" 
                        color="primary" 
                        onClick={() => handleEdit(hospital)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleDelete(hospital.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <LocationIcon color="action" />
                    <Typography color="text.secondary" variant="body1">
                      {hospital.address}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <PhoneIcon color="primary" />
                    <Typography variant="body1" fontWeight="medium">
                      {hospital.phone}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <AmbulanceIcon color="primary" />
                    <Typography variant="body1" fontWeight="medium">
                      {hospital.ambulanceCount} ambulances available
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Chip
                      label={hospital.emergencyCapacity ? 'Accepting Emergency' : 'Limited Capacity'}
                      color={hospital.emergencyCapacity ? 'success' : 'warning'}
                      sx={{ 
                        fontWeight: 'bold',
                        px: 2,
                        '& .MuiChip-label': { px: 1 },
                      }}
                    />
                    <Typography
                      variant="body1"
                      color={hospital.availableBeds < 5 ? 'error.main' : 'success.main'}
                      sx={{ mt: 2, fontWeight: 'bold' }}
                    >
                      {hospital.availableBeds} beds available
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {hospital.specialties.map((specialty) => (
                      <Chip
                        key={specialty}
                        label={specialty}
                        variant="outlined"
                        sx={{ 
                          borderWidth: 2,
                          fontWeight: 'medium',
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Table View */}
      {currentTab === 1 && (
        <TableContainer component={Paper} sx={styles.tableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Hospital</TableCell>
                <TableCell>Address</TableCell>
                <TableCell align="center">Available Beds</TableCell>
                <TableCell align="center">Emergency Status</TableCell>
                <TableCell align="center">Ambulances</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredHospitals.map((hospital) => (
                <TableRow 
                  key={hospital.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <HospitalIcon />
                      </Avatar>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {hospital.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{hospital.address}</TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="h6"
                      color={hospital.availableBeds < 5 ? 'error' : 'success'}
                      fontWeight="bold"
                    >
                      {hospital.availableBeds}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={hospital.emergencyCapacity ? 'Accepting' : 'Limited'}
                      color={hospital.emergencyCapacity ? 'success' : 'warning'}
                      sx={{ fontWeight: 'bold' }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="h6" fontWeight="bold">
                      {hospital.ambulanceCount}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      color="primary" 
                      onClick={() => handleEdit(hospital)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDelete(hospital.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Map View */}
      {currentTab === 2 && (
        <Box sx={{ height: '600px', width: '100%' }}>
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredHospitals.map((hospital) => (
              hospital.coordinates && (
                <Marker
                  key={hospital.id}
                  position={[hospital.coordinates.lat, hospital.coordinates.lng]}
                >
                  <Popup>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {hospital.name}
                    </Typography>
                    <Typography variant="body2">{hospital.address}</Typography>
                    <Typography variant="body2">
                      Available Beds: {hospital.availableBeds}
                    </Typography>
                    <Typography variant="body2">
                      Ambulances: {hospital.ambulanceCount}
                    </Typography>
                  </Popup>
                </Marker>
              )
            ))}
          </MapContainer>
        </Box>
      )}

      {/* Edit/Add Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          },
        }}
      >
        <DialogTitle sx={{ pb: 0 }}>
          <Typography variant="h5" fontWeight="bold">
            {selectedHospital ? 'Edit Hospital' : 'Add New Hospital'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Hospital Name"
              fullWidth
              value={selectedHospital?.name || ''}
              onChange={(e) => setSelectedHospital(prev => prev ? { ...prev, name: e.target.value } : null)}
              sx={{ '& .MuiOutlinedInput-notchedOutline': { borderWidth: 2 } }}
            />
            <TextField
              label="Address"
              fullWidth
              value={selectedHospital?.address || ''}
              onChange={(e) => setSelectedHospital(prev => prev ? { ...prev, address: e.target.value } : null)}
              sx={{ '& .MuiOutlinedInput-notchedOutline': { borderWidth: 2 } }}
            />
            <TextField
              label="Phone"
              fullWidth
              value={selectedHospital?.phone || ''}
              onChange={(e) => setSelectedHospital(prev => prev ? { ...prev, phone: e.target.value } : null)}
              sx={{ '& .MuiOutlinedInput-notchedOutline': { borderWidth: 2 } }}
            />
            <TextField
              label="Available Beds"
              type="number"
              fullWidth
              value={selectedHospital?.availableBeds || ''}
              onChange={(e) => setSelectedHospital(prev => prev ? { ...prev, availableBeds: parseInt(e.target.value) } : null)}
              sx={{ '& .MuiOutlinedInput-notchedOutline': { borderWidth: 2 } }}
            />
            <TextField
              label="Ambulance Count"
              type="number"
              fullWidth
              value={selectedHospital?.ambulanceCount || ''}
              onChange={(e) => setSelectedHospital(prev => prev ? { ...prev, ambulanceCount: parseInt(e.target.value) } : null)}
              sx={{ '& .MuiOutlinedInput-notchedOutline': { borderWidth: 2 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            variant="outlined"
            sx={{ 
              borderWidth: 2,
              '&:hover': { borderWidth: 2 },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            color="primary"
            sx={{ 
              px: 4,
              py: 1,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            borderRadius: 2,
            '& .MuiAlert-icon': {
              fontSize: '1.5rem',
            },
          }}
        >
          <Typography variant="subtitle1" fontWeight="medium">
            {snackbar.message}
          </Typography>
        </Alert>
      </Snackbar>

      {/* Speed Dial for Quick Actions */}
      <SpeedDial
        ariaLabel="Quick actions"
        sx={styles.speedDial}
        icon={<SpeedDialIcon />}
      >
        {quickActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.action}
            sx={{
              '& .MuiFab-primary': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              },
            }}
          />
        ))}
      </SpeedDial>
    </Box>
  );
} 