import {
  AppBar,
  Link,
  Toolbar,
  Typography,
  Box,
  Drawer,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { useState, useEffect } from 'react';
import ExploreCategories from '../../components/SecondaryDraw/ExploreCategories';

const PrimaryAppBar: React.FC = () => {
  const theme = useTheme();
  const [sideMenu, setSideMenu] = useState(false);
  const isSmallScreen = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect(() => {
    // if the screen size is bigger than  sm and the side menu is open, then close the side menu
    if (isSmallScreen && sideMenu) {
      setSideMenu(false);
    }
  }, [isSmallScreen]);

  // If the event is a keyboard event, then check if the key is Tab or Shift
  // If it is, then do nothing (Because the user is usually navigating the page using Tab or Shift)
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setSideMenu(open);
    };

  const list = () => (
    <Box
      sx={{
        minWidth: 200,
        paddingTop: `${theme.primaryAppBar.height}px`,
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <ExploreCategories />
    </Box>
  );

  return (
    <AppBar
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.background.default,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar
        variant="dense"
        sx={{
          height: theme.primaryAppBar.height,
          minHeight: theme.primaryAppBar.height,
        }}
      >
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(!sideMenu)}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        <Drawer anchor="left" open={sideMenu} onClose={toggleDrawer(false)}>
          {list()}
        </Drawer>

        <Link href="/" underline="none" color="inherit">
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ display: { fontWeight: 700, letterSpacing: '-0.5px' } }}
          >
            DJCHAT
          </Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default PrimaryAppBar;
