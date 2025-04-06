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
} from '@mui/icons-material';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotification } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/' },
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
      duration: 0.3,
      type: "spring",
      stiffness: 500,
      damping: 40
    }
  },
  closed: {
    width: 72,
    transition: { 
      duration: 0.3,
      type: "spring",
      stiffness: 500,
      damping: 40
    }
  },
  mobile: {
    width: drawerWidth,
    x: 0,
    transition: { 
      duration: 0.3,
      type: "spring",
      stiffness: 500,
      damping: 40
    }
  },
  mobileClosed: {
    width: drawerWidth,
    x: -drawerWidth,
    transition: { 
      duration: 0.3,
      type: "spring",
      stiffness: 500,
      damping: 40
    }
  }
};

const contentVariants: Variants = {
  open: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: { 
      duration: 0.3,
      type: "spring",
      stiffness: 500,
      damping: 40
    }
  },
  closed: {
    marginLeft: 72,
    width: `calc(100% - 72px)`,
    transition: { 
      duration: 0.3,
      type: "spring",
      stiffness: 500,
      damping: 40
    }
  },
  mobile: {
    marginLeft: 0,
    width: '100%',
    transition: { 
      duration: 0.3
    }
  }
};

const menuItemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: -20 
  },
  visible: (i: number) => ({ 
    opacity: 1, 
    x: 0,
    transition: { 
      delay: i * 0.05,
      duration: 0.3,
      ease: "easeOut"
    }
  }),
  hover: {
    x: 6,
    transition: { 
      duration: 0.2, 
      ease: "easeOut" 
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
  const { mode, toggleTheme } = useTheme();
  const { notifications, showNotification, requestPermission } = useNotification();
  const { user, logout } = useAuth();
  const notificationCount = notifications.length;
  
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

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <AppBar
        component={motion.div}
        initial={{ y: -70 }}
        animate={{ y: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 500,
          damping: 30
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
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
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
          <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
            <IconButton 
              component={motion.button}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme} 
              sx={{ mr: 2 }}
            >
              {mode === 'dark' ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton 
              component={motion.button}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
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
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
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
                {user?.firstName ? user.firstName[0] : <AccountCircle />}
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
          variants: drawerVariants,
          initial: isMobile ? 'mobileClosed' : 'closed',
          animate: isMobile 
            ? (drawerOpen ? 'mobile' : 'mobileClosed') 
            : (drawerOpen ? 'open' : 'closed'),
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            background: `linear-gradient(45deg, ${alpha(muiTheme.palette.primary.main, 0.1)}, ${alpha(muiTheme.palette.secondary.main, 0.1)})`,
          }}
        >
          <AnimatePresence>
            {drawerOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
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
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDrawerToggle}
            >
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Box>
        <Divider sx={{ opacity: 0.1 }} />
        <List>
          <AnimatePresence>
            {menuItems.map((item, i) => {
              const isActive = location.pathname === item.path || 
                (item.path !== '/' && location.pathname.startsWith(item.path));
              
              return (
                <motion.div
                  key={item.text}
                  custom={i}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => navigate(item.path)}
                      sx={{
                        minHeight: 48,
                        px: 2.5,
                        position: 'relative',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
                          transition: 'color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <AnimatePresence>
                        {drawerOpen && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
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
          </AnimatePresence>
        </List>
      </Drawer>

      <Box
        component={motion.div}
        variants={contentVariants}
        initial={isMobile ? 'mobile' : 'closed'}
        animate={isMobile ? 'mobile' : (drawerOpen ? 'open' : 'closed')}
        onScroll={handleScroll}
        className="gpu-accelerated"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          position: 'relative',
          pt: { xs: 8, sm: 9 },
          pb: 3,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: `linear-gradient(135deg, ${alpha(muiTheme.palette.background.default, 0.9)} 0%, ${alpha(muiTheme.palette.background.paper, 0.9)} 100%)`,
          backdropFilter: 'blur(8px)',
          scrollbarWidth: 'thin',
          scrollbarColor: `${alpha(muiTheme.palette.primary.main, 0.2)} transparent`,
          '&::-webkit-scrollbar': {
            width: '8px',
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
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ paddingLeft: 24, paddingRight: 24 }}
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
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
          {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Profile'}
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
    </Box>
  );
};

export default Layout; 