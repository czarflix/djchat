import React from 'react';
import PrimaryAppBar from './templates/PrimaryAppBar.tsx';
import PrimaryDrawer from './templates/PrimaryDraw.tsx';
import { Box, CssBaseline } from '@mui/material';
import SecondaryDrawer from './templates/SecondaryDrawer.tsx';
import PopularChannels from '../components/PrimaryDrawer/PopularChannels.tsx';
import ExploreCategories from '../components/SecondaryDraw/ExploreCategories.tsx';
import Main from './templates/Main.tsx';
import ExploreServers from '../components/Main/ExploreServers.tsx';

const Home: React.FC = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <PrimaryAppBar />
      <PrimaryDrawer>
        <PopularChannels open={false} />
      </PrimaryDrawer>
      <SecondaryDrawer>
        <ExploreCategories />
      </SecondaryDrawer>
      <Main>
        <ExploreServers />
      </Main>
    </Box>
  );
};

export default Home;
