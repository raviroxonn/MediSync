import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Switch,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Stack,
  Grid,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import {
  Notifications,
  VolumeUp,
  Brightness4,
  Language,
  Security,
  Storage,
  Sync,
  CloudUpload,
  Api,
  Settings as SettingsIcon,
  LocationOn,
  Speed,
  Backup,
} from '@mui/icons-material';
import { useState } from 'react';

interface Settings {
  notifications: boolean;
  sound: boolean;
  darkMode: boolean;
  language: string;
  autoSync: boolean;
  dataRetention: string;
  emergencyAlerts: boolean;
  locationTracking: boolean;
  performanceMode: string;
  backupFrequency: string;
  apiEndpoint: string;
}

export default function Settings() {
  const [settings, setSettings] = useState<Settings>({
    notifications: true,
    sound: true,
    darkMode: false,
    language: 'en',
    autoSync: true,
    dataRetention: '30',
    emergencyAlerts: true,
    locationTracking: true,
    performanceMode: 'balanced',
    backupFrequency: 'daily',
    apiEndpoint: 'https://api.medisync.com/v1',
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleToggle = (setting: keyof Settings) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleChange = (setting: keyof Settings, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleSave = () => {
    setSaveStatus('saving');
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 1000);
  };

  const handleReset = () => {
    // Implement reset logic
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Settings
      </Typography>

      {saveStatus === 'saved' && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      {saveStatus === 'error' && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error saving settings. Please try again.
        </Alert>
      )}

      <Stack spacing={3}>
        {/* Notifications and Alerts */}
        <Paper>
          <Typography variant="h6" sx={{ p: 2, pb: 0 }}>
            Notifications & Alerts
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Notifications />
              </ListItemIcon>
              <ListItemText
                primary="Push Notifications"
                secondary="Enable push notifications for emergencies"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={settings.notifications}
                  onChange={() => handleToggle('notifications')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <VolumeUp />
              </ListItemIcon>
              <ListItemText
                primary="Sound Alerts"
                secondary="Play sound for critical notifications"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={settings.sound}
                  onChange={() => handleToggle('sound')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <Security />
              </ListItemIcon>
              <ListItemText
                primary="Emergency Alerts"
                secondary="Receive high-priority emergency alerts"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={settings.emergencyAlerts}
                  onChange={() => handleToggle('emergencyAlerts')}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>

        {/* System Preferences */}
        <Paper>
          <Typography variant="h6" sx={{ p: 2, pb: 0 }}>
            System Preferences
          </Typography>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="language-label">Language</InputLabel>
                  <Select
                    labelId="language-label"
                    value={settings.language}
                    label="Language"
                    onChange={(e) => handleChange('language', e.target.value)}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="performance-label">Performance Mode</InputLabel>
                  <Select
                    labelId="performance-label"
                    value={settings.performanceMode}
                    label="Performance Mode"
                    onChange={(e) => handleChange('performanceMode', e.target.value)}
                  >
                    <MenuItem value="high">High Performance</MenuItem>
                    <MenuItem value="balanced">Balanced</MenuItem>
                    <MenuItem value="battery">Battery Saver</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    label="Data Retention (days)"
                    type="number"
                    value={settings.dataRetention}
                    onChange={(e) => handleChange('dataRetention', e.target.value)}
                    InputProps={{ inputProps: { min: 1, max: 365 } }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="backup-label">Backup Frequency</InputLabel>
                  <Select
                    labelId="backup-label"
                    value={settings.backupFrequency}
                    label="Backup Frequency"
                    onChange={(e) => handleChange('backupFrequency', e.target.value)}
                  >
                    <MenuItem value="hourly">Every Hour</MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Advanced Settings */}
        <Paper>
          <Typography variant="h6" sx={{ p: 2, pb: 0 }}>
            Advanced Settings
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Brightness4 />
              </ListItemIcon>
              <ListItemText
                primary="Dark Mode"
                secondary="Use dark theme"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={settings.darkMode}
                  onChange={() => handleToggle('darkMode')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <LocationOn />
              </ListItemIcon>
              <ListItemText
                primary="Location Tracking"
                secondary="Enable location tracking for emergency response"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={settings.locationTracking}
                  onChange={() => handleToggle('locationTracking')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <Sync />
              </ListItemIcon>
              <ListItemText
                primary="Auto-Sync"
                secondary="Automatically sync data with central server"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={settings.autoSync}
                  onChange={() => handleToggle('autoSync')}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>

        {/* API Configuration */}
        <Paper>
          <Typography variant="h6" sx={{ p: 2, pb: 0 }}>
            API Configuration
          </Typography>
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              label="API Endpoint"
              value={settings.apiEndpoint}
              onChange={(e) => handleChange('apiEndpoint', e.target.value)}
              variant="outlined"
            />
          </Box>
        </Paper>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleReset}
            startIcon={<SettingsIcon />}
          >
            Reset to Defaults
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            startIcon={<CloudUpload />}
          >
            {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
} 