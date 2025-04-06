import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme as useMuiTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  ListItemButton,
  Avatar,
  Badge,
  alpha,
  Tooltip,
  Switch,
  FormControlLabel,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  LocalHospital,
  Warning as Emergency,
  People,
  Settings,
  PersonAdd,
  ChevronLeft as ChevronLeftIcon,
  Notifications,
  AccountCircle,
  DarkMode,
  LightMode,
  Logout as LogoutIcon,
  Person as PersonIcon,
  DirectionsRun,
  BrightnessAuto,
  Brightness4,
  Brightness7,
  Computer,
  NightsStay,
  WbSunny,
} from '@mui/icons-material';
import { motion, AnimatePresence, Variants, useReducedMotion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotification } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Hospitals', icon: <LocalHospital />, path: '/hospitals' },
  { text: 'Emergencies', icon: <Emergency />, path: '/emergencies' },
  { text: 'Patients', icon: <PersonIcon />, path: '/patients' },
  { text: 'Staff', icon: <People />, path: '/staff' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
];

// Animation variants
const drawerVariants: Variants = {
  open: {
    width: drawerWidth,
    transition: { 
      duration: 0.2,
      type: "tween",
    }
  },
  closed: {
    width: 72,
    transition: { 
      duration: 0.2,
      type: "tween",
    }
  },
  mobile: {
    width: drawerWidth,
    x: 0,
    transition: { 
      duration: 0.2,
      type: "tween",
    }
  },
  mobileClosed: {
    width: drawerWidth,
    x: -drawerWidth,
    transition: { 
      duration: 0.2,
      type: "tween",
    }
  }
};

const contentVariants: Variants = {
  open: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: { 
      duration: 0.2,
      type: "tween",
    }
  },
  closed: {
    marginLeft: 72,
    width: `calc(100% - 72px)`,
    transition: { 
      duration: 0.2,
      type: "tween",
    }
  },
  mobile: {
    marginLeft: 0,
    width: '100%',
    transition: { 
      duration: 0.2,
      type: "tween",
    }
  }
};

const menuItemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: -10 
  },
  visible: (i: number) => ({ 
    opacity: 1, 
    x: 0,
    transition: { 
      delay: i * 0.03,
      duration: 0.2,
    }
  }),
  hover: {
    x: 5,
    transition: { 
      duration: 0.2, 
    }
  }
};

const Layout = () => {
  const muiTheme = useMuiTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState<null | HTMLElement>(null);
  const { mode, toggleTheme, isSystemTheme, toggleSystemTheme, setIsSystemTheme, setThemeMode } = useTheme();
  const { notifications, showNotification, requestPermission } = useNotification();
  const { user, logout } = useAuth();
  const notificationCount = notifications.length;
  const shouldReduceMotion = useReducedMotion();
  
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setDrawerOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    requestPermission();
    
    showNotification(
      'Welcome to MediSync! Your emergency response system is active.',
      'success',
      'System Status'
    );

    const timer = setTimeout(() => {
      showNotification(
        'New emergency case reported in Downtown Area',
        'warning',
        'Emergency Alert'
      );
    }, 2000);

    return () => clearTimeout(timer);
  }, [showNotification, requestPermission]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (scrollTop > 20 && !scrolled) {
      setScrolled(true);
    } else if (scrollTop <= 20 && scrolled) {
      setScrolled(false);
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = () => {
    showNotification(
      'You have ' + notificationCount + ' active notifications',
      'info',
      'Notification Center'
    );
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
  };

  const handleSettingsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsMenuClose = () => {
    setSettingsAnchorEl(null);
  };

  // Simplified animations for reduced motion
  const getAnimationProps = () => {
    if (shouldReduceMotion) {
      return {
        initial: undefined,
        animate: undefined,
        transition: undefined,
        variants: undefined,
      };
    }
    return {};
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <AppBar
        component={motion.div}
        initial={shouldReduceMotion ? undefined : { y: -10 }}
        animate={shouldReduceMotion ? undefined : { y: 0 }}
        transition={shouldReduceMotion ? undefined : { 
          duration: 0.2,
          type: "tween",
        }}
        position="fixed"
        elevation={0}
        sx={{
          width: { 
            xs: '100%', 
            md: `calc(100% - ${drawerOpen ? drawerWidth : 72}px)` 
          },
          ml: { 
            xs: 0, 
            md: `${drawerOpen ? drawerWidth : 72}px` 
          },
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          backdropFilter: 'blur(10px)',
          backgroundColor: alpha(
            muiTheme.palette.background.default, 
            scrolled ? 0.9 : 0.7
          ),
          borderBottom: `1px solid ${alpha(muiTheme.palette.divider, scrolled ? 0.2 : 0.1)}`,
          boxShadow: scrolled 
            ? `0 4px 20px -4px ${alpha(muiTheme.palette.common.black, 0.1)}` 
            : 'none',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            component={motion.button}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { md: 'none' },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Theme settings">
            <IconButton 
              component={motion.button}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
              onClick={handleSettingsMenuOpen}
              sx={{ mr: 2 }}
            >
              {isSystemTheme ? 
                <Computer sx={{ 
                  fontSize: 24, 
                  color: muiTheme.palette.primary.main 
                }} /> : 
                mode === 'dark' ? 
                <NightsStay sx={{ 
                  fontSize: 24, 
                  color: alpha(muiTheme.palette.primary.light, 0.9) 
                }} /> : 
                <WbSunny sx={{ 
                  fontSize: 24, 
                  color: muiTheme.palette.warning.main 
                }} />
              }
            </IconButton>
          </Tooltip>
          <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            <IconButton 
              component={motion.button}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
              onClick={toggleTheme}
              sx={{ mr: 2 }}
            >
              {mode === 'dark' ? 
                <Brightness7 sx={{ 
                  fontSize: 22, 
                  color: muiTheme.palette.warning.light 
                }} /> : 
                <Brightness4 sx={{ 
                  fontSize: 22, 
                  color: alpha(muiTheme.palette.primary.light, 0.8) 
                }} />
              }
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton 
              component={motion.button}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
              onClick={handleNotificationClick}
              sx={{ mr: 2 }}
            >
              <Badge 
                badgeContent={notificationCount} 
                color="error"
              >
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Profile">
            <IconButton
              component={motion.button}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
              onClick={handleProfileMenuOpen}
              sx={{
                padding: 0.5,
                border: `2px solid ${muiTheme.palette.primary.main}`,
              }}
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32,
                  background: `linear-gradient(45deg, ${muiTheme.palette.primary.main}, ${muiTheme.palette.secondary.main})`,
                }}
              >
                {user?.name ? user.name[0] : <AccountCircle />}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={drawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          component: motion.div,
          variants: shouldReduceMotion ? undefined : drawerVariants,
          initial: shouldReduceMotion ? undefined : (isMobile ? 'mobileClosed' : 'closed'),
          animate: shouldReduceMotion ? undefined : (isMobile 
            ? (drawerOpen ? 'mobile' : 'mobileClosed') 
            : (drawerOpen ? 'open' : 'closed')),
          sx: {
            backgroundColor: alpha(muiTheme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
            borderRight: `1px solid ${alpha(muiTheme.palette.divider, 0.1)}`,
            overflow: 'hidden',
            height: '100%',
            boxShadow: isMobile ? `4px 0 25px ${alpha(muiTheme.palette.common.black, 0.15)}` : 'none',
            position: 'fixed',
          },
        }}
      >
        <Box 
          component={motion.div}
          initial={shouldReduceMotion ? undefined : { opacity: 0 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1 }}
          transition={shouldReduceMotion ? undefined : { duration: 0.2 }}
          sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            background: `linear-gradient(45deg, ${alpha(muiTheme.palette.primary.main, 0.1)}, ${alpha(muiTheme.palette.secondary.main, 0.1)})`,
          }}
        >
          <AnimatePresence mode="wait">
            {drawerOpen && (
              <motion.div
                initial={shouldReduceMotion ? undefined : { opacity: 0, x: -10 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, x: -10 }}
                transition={shouldReduceMotion ? undefined : { duration: 0.2 }}
              >
                <Typography variant="h6" color="primary" fontWeight="bold">
                  MediSync
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
          {isMobile && (
            <IconButton 
              component={motion.button}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
              onClick={handleDrawerToggle}
            >
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Box>
        <Divider sx={{ opacity: 0.1 }} />
        <List>
          {menuItems.map((item, i) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path));
            
            return (
              <motion.div
                key={item.text}
                custom={i}
                variants={shouldReduceMotion ? undefined : menuItemVariants}
                initial={shouldReduceMotion ? undefined : "hidden"}
                animate={shouldReduceMotion ? undefined : "visible"}
                whileHover={shouldReduceMotion ? undefined : "hover"}
                style={{
                  marginBottom: 4
                }}
              >
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    sx={{
                      minHeight: 48,
                      px: 2.5,
                      position: 'relative',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      backgroundColor: isActive ? alpha(muiTheme.palette.primary.main, 0.1) : 'transparent',
                      borderRadius: 1,
                      mx: 1,
                      '&:hover': {
                        backgroundColor: alpha(muiTheme.palette.primary.main, 0.1),
                      },
                      '&::before': isActive ? {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 8,
                        bottom: 8,
                        width: 3,
                        borderRadius: '0 4px 4px 0',
                        backgroundColor: muiTheme.palette.primary.main,
                      } : {},
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: drawerOpen ? 2 : 'auto',
                        justifyContent: 'center',
                        color: isActive ? muiTheme.palette.primary.main : muiTheme.palette.text.primary,
                        transition: 'color 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <AnimatePresence mode="wait">
                      {drawerOpen && (
                        <motion.div
                          initial={shouldReduceMotion ? undefined : { opacity: 0, x: -5 }}
                          animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                          exit={shouldReduceMotion ? undefined : { opacity: 0, x: -5 }}
                          transition={shouldReduceMotion ? undefined : { duration: 0.2 }}
                        >
                          <ListItemText 
                            primary={item.text}
                            sx={{
                              color: isActive ? muiTheme.palette.primary.main : muiTheme.palette.text.primary,
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </ListItemButton>
                </ListItem>
              </motion.div>
            );
          })}
        </List>
      </Drawer>

      <Box
        component={motion.div}
        variants={shouldReduceMotion ? undefined : contentVariants}
        initial={shouldReduceMotion ? undefined : (isMobile ? 'mobile' : 'closed')}
        animate={shouldReduceMotion ? undefined : (isMobile ? 'mobile' : (drawerOpen ? 'open' : 'closed'))}
        onScroll={handleScroll}
        className="gpu-accelerated"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          position: 'relative',
          pt: { xs: 8, sm: 9 },
          pb: 3,
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          background: `linear-gradient(135deg, ${alpha(muiTheme.palette.background.default, 0.9)} 0%, ${alpha(muiTheme.palette.background.paper, 0.9)} 100%)`,
          backdropFilter: 'blur(8px)',
          scrollbarWidth: 'thin',
          scrollbarColor: `${alpha(muiTheme.palette.primary.main, 0.2)} transparent`,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: alpha(muiTheme.palette.primary.main, 0.2),
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: alpha(muiTheme.palette.primary.main, 0.3),
          },
        }}
      >
        <AnimatePresence mode="wait" presenceAffectsLayout={false}>
          <motion.div
            key={location.pathname}
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 5 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -5 }}
            transition={shouldReduceMotion ? undefined : { duration: 0.2 }}
            style={{ 
              paddingLeft: 24, 
              paddingRight: 24,
              height: '100%',
            }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1,
            minWidth: 200,
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
            backdropFilter: 'blur(10px)',
            backgroundColor: alpha(muiTheme.palette.background.paper, 0.9),
            border: `1px solid ${alpha(muiTheme.palette.divider, 0.1)}`,
            borderRadius: 2,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: alpha(muiTheme.palette.background.paper, 0.9),
              backdropFilter: 'blur(10px)',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
              borderTop: `1px solid ${alpha(muiTheme.palette.divider, 0.1)}`,
              borderLeft: `1px solid ${alpha(muiTheme.palette.divider, 0.1)}`,
            },
            '& .MuiMenuItem-root': {
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: alpha(muiTheme.palette.primary.main, 0.1),
                paddingLeft: '24px',
              },
            },
          },
        }}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          {user?.name || 'Profile'}
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider sx={{ opacity: 0.1 }} />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={settingsAnchorEl}
        open={Boolean(settingsAnchorEl)}
        onClose={handleSettingsMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1,
            minWidth: 260,
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
            backdropFilter: 'blur(10px)',
            backgroundColor: alpha(muiTheme.palette.background.paper, 0.9),
            border: `1px solid ${alpha(muiTheme.palette.divider, 0.1)}`,
            borderRadius: 2,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: alpha(muiTheme.palette.background.paper, 0.9),
              backdropFilter: 'blur(10px)',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
              borderTop: `1px solid ${alpha(muiTheme.palette.divider, 0.1)}`,
              borderLeft: `1px solid ${alpha(muiTheme.palette.divider, 0.1)}`,
            },
          },
        }}
      >
        <MenuItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
          <Typography variant="subtitle1" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
            Theme Preferences
          </Typography>
          
          <Box sx={{ width: '100%', mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Choose theme mode:
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
              <Button 
                variant={mode === 'light' && !isSystemTheme ? "contained" : "outlined"}
                onClick={() => {
                  setIsSystemTheme(false);
                  setThemeMode('light');
                }}
                startIcon={<WbSunny />}
                size="small"
                sx={{ flex: 1, borderRadius: 2 }}
              >
                Light
              </Button>
              <Button 
                variant={isSystemTheme ? "contained" : "outlined"}
                onClick={() => toggleSystemTheme()}
                startIcon={<Computer />}
                size="small"
                sx={{ flex: 1, borderRadius: 2 }}
              >
                System
              </Button>
              <Button 
                variant={mode === 'dark' && !isSystemTheme ? "contained" : "outlined"}
                onClick={() => {
                  setIsSystemTheme(false);
                  setThemeMode('dark');
                }}
                startIcon={<NightsStay />}
                size="small"
                sx={{ flex: 1, borderRadius: 2 }}
              >
                Dark
              </Button>
            </Box>
          </Box>
          
          <Divider sx={{ width: '100%', my: 1, opacity: 0.1 }} />
          
          <FormControlLabel
            control={
              <Switch 
                checked={isSystemTheme}
                onChange={toggleSystemTheme}
                color="primary"
              />
            }
            label="Sync with system"
            sx={{ mb: 1, width: '100%' }}
          />
          {!isSystemTheme && (
            <FormControlLabel
              control={
                <Switch 
                  checked={mode === 'dark'}
                  onChange={toggleTheme}
                  color="primary"
                />
              }
              label="Dark mode"
              sx={{ width: '100%' }}
            />
          )}
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Layout; 