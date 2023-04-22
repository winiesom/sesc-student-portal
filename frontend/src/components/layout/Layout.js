import { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Cookies from "js-cookie";
import { styled, useTheme } from '@mui/material/styles';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  IconButton,
  Toolbar,
  Box, 
  CssBaseline, 
  Typography, 
  Divider
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import {
  ViewModule as ViewModuleIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  AccountBox as AccountBoxIcon,
  School as SchoolIcon,
  FactCheck as FactCheckIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

import {useSelector} from 'react-redux';

import Courses from '../pages/Courses';
import Enrolments from '../pages/Enrolments';
import Eligibility from '../pages/Eligibility';
import Profile from '../pages/Profile';

import { Colors } from "../../assets/themes/colors"
import "../../styles/common.styles.css"

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: Colors.primary,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const pages = ['Courses', 'Enrolments', 'Eligibility', 'Profile'];


const Layout = () => {
  const accessToken = Cookies.get("access");
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const { isLoggedIn } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!isLoggedIn) return Navigate("/");
    if (!(accessToken)) return Navigate("/");
  }, [accessToken, isLoggedIn]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" className="user-greeting">
          Welcome {user && user.first_name + " " + user.last_name}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
           {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
         </IconButton>
       </DrawerHeader>

       <Divider />

        <List>

        {pages.map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                component={Link}
                to={text === "Courses" ? '/home/courses' : text === "Enrolments" ? '/home/enrolments' : text === "Eligibility" ? '/home/eligibility' : text === "Profile" ? '/home/profile' : ""}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {text === "Courses" ? <ViewModuleIcon /> : text === "Enrolments" ? <FactCheckIcon /> : text === "Eligibility" ? <SchoolIcon /> : text === "Profile" ? <AccountBoxIcon /> : ""}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}

        </List>
        <Divider />
        <List>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                 <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
        </List>
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, p: 3}}>
        <DrawerHeader />
        <Routes>
          <Route path="/courses" element={<Courses />} />
          <Route path="/enrolments" element={<Enrolments />} />
          <Route path="/eligibility" element={<Eligibility />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default Layout;
