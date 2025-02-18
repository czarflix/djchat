import { Box, Typography, useMediaQuery, styled } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import React from 'react';
import ToggleDrawer from '../../components/PrimaryDrawer/ToggleDrawer';
import MuiDrawer from '@mui/material/Drawer';

type Props = {
  children: React.ReactNode;
};

type ChildrenProps = {
  open: boolean;
};

type ChildElement = React.ReactElement<ChildrenProps>;

const PrimaryDraw: React.FC<Props> = ({ children }) => {
  const isBelowSm = useMediaQuery('(max-width: 599px)');
  const [open, setOpen] = useState(!isBelowSm); // if the screen size is below sm, then the drawer is closed
  const theme = useTheme();

  const openedMixin = () => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  });

  const closedMixin = () => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    width: `${theme.primaryDrawer.onCloseWidth}px`,
  });

  const Drawer = styled(
    MuiDrawer,
    {}
  )(({ theme, open }) => ({
    width: `${theme.primaryDrawer.width}px`,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(),
      '& .MuiDrawer-paper': openedMixin(),
    }),
    ...(!open && {
      ...closedMixin(),
      '& .MuiDrawer-paper': closedMixin(),
    }),
  }));

  useEffect(() => {
    setOpen(!isBelowSm);
  }, [isBelowSm]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Drawer
      open={open}
      variant={isBelowSm ? 'temporary' : 'permanent'}
      PaperProps={{
        sx: {
          mt: `${theme.primaryAppBar.height}px`,
          height: `calc(100vh - ${theme.primaryAppBar.height}px)`, // 100vh - height of the appbar
          width: theme.primaryDrawer.width,
        },
      }}
    >
      {/* <Box sx={{ display: "flex", flexDirection: "row" , justifyContent: "space-between", mb: "5px", mr:"5px", pl: "5px"}}>
        <Typography  sx={{display:"flex" ,justifyContent: "center", alignContent: "center" ,fontSize: "5rm" }}>
          Popular 
        </Typography> */}
      {/* </Box> */}
      <Box>
        {
          // Iterate Over Children
          // if the child is a valid react element, then clone it and pass the open prop to it
          React.Children.map(children, (child) => {
            return React.isValidElement(child)
              ? React.cloneElement(child as ChildElement, { open: open })
              : child;
          })
        }
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            p: 0,
            width: open ? 'auto' : '100%',
          }}
        >
          <ToggleDrawer
            open={open}
            handleDrawerOpen={handleDrawerOpen}
            handleDrawerClose={handleDrawerClose}
          />
        </Box>
      </Box>
    </Drawer>
  );
};

export default PrimaryDraw;
