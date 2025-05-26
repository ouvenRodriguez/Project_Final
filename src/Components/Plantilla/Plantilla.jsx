import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate, Outlet } from 'react-router-dom';
import './Plantilla.css';

const drawerWidth = 260;

const getSidebarSections = (role) => {
  const allSections = [
    {
      title: 'Usuarios',
      items: [
        {
          label: 'Docentes',
          id: 'docentes',
          icon: <HomeRepairServiceIcon />,
          roles: ['Coordinador'],
          children: [
            { label: 'Agregar', id: 'register-docente', icon: <CreateNewFolderIcon />, roles: ['Coordinador'] },
            { label: 'Todos', id: 'list-docentes', icon: <ListAltIcon />, roles: ['Coordinador'] }
          ]
        },
        {
          label: 'Estudiantes',
          id: 'estudiantes',
          icon: <SchoolIcon />,
          roles: ['Profesor', 'Coordinador'],
          children: [
            { label: 'Agregar', id: 'register-estudiante', icon: <CreateNewFolderIcon />, roles: ['Profesor', 'Coordinador'] },
            { label: 'Todos', id: 'list-estudiantes', icon: <ListAltIcon />, roles: ['Profesor', 'Coordinador'] }
          ]
        }
      ]
    },
    {
      title: 'Proyectos',
      items: [
        {
          label: role === 'Estudiante' ? 'Mis Proyectos' : 'Proyectos',
          id: 'proyectos',
          icon: <BarChartIcon />,
          roles: ['Profesor', 'Coordinador', 'Estudiante'],
          children: [
            { label: 'Crear', id: 'create-project', icon: <CreateNewFolderIcon />, roles: ['Profesor'] },
            { label: 'Todos', id: 'list-projects', icon: <ListAltIcon />, roles: ['Profesor', 'Coordinador'] },
            { label: 'Mis Proyectos', id: 'list-projects-student', icon: <ListAltIcon />, roles: ['Estudiante'] }
          ]
        },
      ],
    },
  ];

  // Filter sections based on role
  return allSections.map(section => ({
    ...section,
    items: section.items
      .filter(item => item.roles.includes(role))
      .map(item => ({
        ...item,
        children: item.children ? item.children.filter(child => child.roles.includes(role)) : undefined
      }))
  })).filter(section => section.items.length > 0);
};

const Plantilla = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const role = localStorage.getItem('@role') || 'Estudiante';
  const sidebarSections = getSidebarSections(role);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleItemExpand = (itemLabel) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemLabel]: !prev[itemLabel]
    }));
  };

  const handleNavigation = (path) => {
    navigate(`/${path}`);
    setMobileOpen(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('@token');
    localStorage.removeItem('@role');
    handleClose();
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ overflow: 'auto', height: '100%' }}>
      {sidebarSections.map((section) => (
        <React.Fragment key={section.title}>
          <Typography variant="caption" sx={{ pl: 2, pt: 2, color: '#888', fontWeight: 700 }}>
            {section.title}
          </Typography>
          <List>
            {section.items.map((item) => (
              item.children ? (
                <React.Fragment key={item.label}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleItemExpand(item.label)}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.label} />
                      {expandedItems[item.label] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </ListItemButton>
                  </ListItem>
                  {expandedItems[item.label] && (
                    <List component="div" disablePadding>
                      {item.children.map((child) => (
                        <ListItem disablePadding key={child.label} sx={{ pl: 4 }}>
                          <ListItemButton
                            onClick={() => handleNavigation(child.id)}
                          >
                            <ListItemIcon>{child.icon}</ListItemIcon>
                            <ListItemText primary={child.label} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </React.Fragment>
              ) : (
                <ListItem disablePadding key={item.label}>
                  <ListItemButton
                    onClick={() => handleNavigation(item.id)}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              )
            ))}
          </List>
        </React.Fragment>
      ))}
    </Box>
  );

  return (
    <div id="layout-background">
      <Box sx={{ display: 'flex', minHeight: '100vh', background: 'transparent' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            height: '64px',
            minHeight: '64px',
            maxHeight: '64px',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', px: 2 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
              <Typography variant="body2" sx={{ mr: 1, color: 'white' }}>
                {role}
              </Typography>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                sx={{ ml: 1 }}
              >
                <AccountCircleIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
              </Menu>
            </Box>
          </Box>
        </AppBar>

        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                top: '64px',
                height: 'calc(100% - 64px)',
                boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)'
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                top: '64px',
                height: 'calc(100% - 64px)',
                boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)'
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            background: 'transparent',
            minHeight: '100vh',
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <div id="layout-content">
            <Box sx={{ mt: 2 }}>
              <Outlet />
            </Box>
          </div>
        </Box>
      </Box>
    </div>
  );
};

export default Plantilla; 