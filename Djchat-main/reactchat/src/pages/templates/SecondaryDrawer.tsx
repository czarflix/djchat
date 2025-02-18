import { Box } from '@mui/material';
import React from 'react';
import { useTheme } from '@mui/material/styles';

type Props = {
  children: React.ReactNode;
};

type ChildElement = React.ReactElement<{}>;

const SecondaryDrawer: React.FC<Props> = ({ children }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        minWidth: `${theme.secondaryDrawer.width}px`,
        height: `calc(100vh - ${theme.primaryAppBar.height}px)`,
        overflowY: 'auto',
        mt: `${theme.primaryAppBar.height}px`,
        borderRight: `1px solid ${theme.palette.divider}`,
        display: { xs: 'none', sm: 'block' },
      }}
    >
      {React.Children.map(children, (child) => {
        return React.isValidElement(child)
          ? React.cloneElement(child as ChildElement, {})
          : child;
      })}
    </Box>
  );
};

export default SecondaryDrawer;
