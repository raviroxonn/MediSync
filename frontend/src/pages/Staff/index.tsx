import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn,
  Timer,
  LocalHospital,
  Phone,
  Email,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useState } from 'react';

interface StaffMember {
  id: number;
  name: string;
  role: string;
  status: 'on-duty' | 'off-duty' | 'on-call';
  location: string;
  hospital: string;
  phone: string;
  email: string;
  shift: string;
  specialty?: string;
  avatar: string;
  nextShift?: string;
  experience: string;
  certifications: string[];
}

// Mock data - In a real app, this would come from an API
const staffMembers: StaffMember[] = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    role: 'Emergency Physician',
    status: 'on-duty',
    location: 'ER Wing',
    hospital: 'Central Hospital',
    phone: '(555) 123-4567',
    email: 'sarah.johnson@medisync.com',
    shift: '7:00 AM - 7:00 PM',
    specialty: 'Trauma Care',
    avatar: 'SJ',
    experience: '10 years',
    certifications: ['ABEM', 'ACLS', 'ATLS'],
  },
  {
    id: 2,
    name: 'James Wilson',
    role: 'Paramedic',
    status: 'on-duty',
    location: 'Ambulance Unit 3',
    hospital: "St. Mary's Medical Center",
    phone: '(555) 234-5678',
    email: 'james.wilson@medisync.com',
    shift: '6:00 AM - 6:00 PM',
    avatar: 'JW',
    experience: '5 years',
    certifications: ['EMT-P', 'ACLS', 'PALS'],
  },
  {
    id: 3,
    name: 'Dr. Michael Chen',
    role: 'Emergency Physician',
    status: 'on-call',
    location: 'Off-site',
    hospital: 'Central Hospital',
    phone: '(555) 345-6789',
    email: 'michael.chen@medisync.com',
    shift: 'On Call',
    specialty: 'Cardiology',
    avatar: 'MC',
    experience: '15 years',
    certifications: ['ABEM', 'ACLS', 'PALS'],
  },
  {
    id: 4,
    name: 'Emma Rodriguez',
    role: 'Emergency Nurse',
    status: 'off-duty',
    location: 'Off-site',
    hospital: 'Community Health Center',
    phone: '(555) 456-7890',
    email: 'emma.rodriguez@medisync.com',
    shift: 'Next: 7:00 PM - 7:00 AM',
    avatar: 'ER',
    nextShift: 'Tomorrow, 7:00 PM',
    experience: '8 years',
    certifications: ['RN', 'ACLS', 'PALS'],
  },
];

export default function Staff() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentTab, setCurrentTab] = useState(0);

  const filteredStaff = staffMembers.filter((staff) => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || staff.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: StaffMember['status']) => {
    switch (status) {
      case 'on-duty':
        return 'success';
      case 'off-duty':
        return 'error';
      case 'on-call':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: StaffMember['status']) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Staff Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Add Staff Member
        </Button>
      </Box>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search staff..."
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
              <MenuItem value="on-duty">On Duty</MenuItem>
              <MenuItem value="off-duty">Off Duty</MenuItem>
              <MenuItem value="on-call">On Call</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
          <Tab label="Staff Cards" />
          <Tab label="Schedule View" />
        </Tabs>
      </Box>

      {/* Staff Cards */}
      {currentTab === 0 && (
        <Grid container spacing={3}>
          {filteredStaff.map((staff) => (
            <Grid item xs={12} md={6} key={staff.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        mr: 2,
                        bgcolor: 'primary.main',
                      }}
                    >
                      {staff.avatar}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h2">
                        {staff.name}
                      </Typography>
                      <Typography color="text.secondary" gutterBottom>
                        {staff.role}
                      </Typography>
                      <Chip
                        label={getStatusLabel(staff.status)}
                        color={getStatusColor(staff.status)}
                        size="small"
                      />
                    </Box>
                    <Box>
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <LocationOn color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary={staff.location}
                        secondary="Current Location"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LocalHospital color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary={staff.hospital}
                        secondary={staff.specialty || 'General Care'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Timer color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary={staff.shift}
                        secondary={staff.nextShift ? `Next Shift: ${staff.nextShift}` : 'Current Shift'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Phone color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary={staff.phone}
                        secondary={staff.email}
                      />
                    </ListItem>
                  </List>

                  <Divider sx={{ my: 2 }} />

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Experience: {staff.experience}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      {staff.certifications.map((cert) => (
                        <Chip
                          key={cert}
                          label={cert}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Schedule View */}
      {currentTab === 1 && (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          Schedule view will be implemented here with a calendar interface showing staff shifts and availability.
        </Typography>
      )}
    </Box>
  );
} 