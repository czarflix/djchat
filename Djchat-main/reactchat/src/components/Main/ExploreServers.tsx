import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  ListItemButton,
  Container,
  Grid,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import React, { useEffect } from 'react';
import useCrud from '../../hooks/useCrud';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { MEDIA_URL } from '../../config';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { CapitalizeFirstLetter } from '../../helpers/utils';
interface Server {
  id: number;
  name: string;
  description: string;
  categories: Array<string>;
  icon: string;
  banner: string;
}

const ExploreServers: React.FC = () => {
  const { categoryName } = useParams();
  const url = categoryName
    ? `server/select/?categories=${categoryName}`
    : `server/select/`;
  const { dataCRUD, fetchData, error, isloading } = useCrud<Server>([], url);

  useEffect(() => {
    fetchData();
  }, [categoryName]);

  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <Box sx={{ pt: 6 }}>
          <Typography
            variant="h3"
            noWrap
            // commponent="h1"
            sx={{
              display: {
                sm: 'block',
                fontWeight: 700,
                fontSize: '48px',
                letterSpacing: '-2px',
              },
              textAlign: { xs: 'center', sm: 'left' },
              textTransform: 'capitalize',
            }}
          >
            {categoryName
              ? categoryName
              : 'Popular Channels'}
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="h6"
            noWrap
            // commponent="h1"
            color={'text.secondary'}
            sx={{
              display: {
                sm: 'block',
                fontWeight: 700,
                fontSize: {xs:'36px' ,sm:'48px'},
                letterSpacing: '-1px',
              },
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            {categoryName
              ? `Channels talking about ${categoryName}`
              : 'Check out some of our popular channels'}
          </Typography>

          <Typography
            variant="h6"
            sx={{ pt: 6, pb: 1, fontWeight: 700, letterSpacing: '-1px' }}
          >
            Recommended Channels
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 0, sm: 2 }}>
          {dataCRUD.map((server) => (
            <Grid item key={server.id} xs={12} sm={6} md={6} lg={3}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'none',
                  backgroundColor: 'inherit',
                  backgroundImage: 'none', // Because if not none it will show a white background or DarkMode background
                }}
              >
                <Link
                  to={`/server/${server.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <CardMedia
                    component="img"
                    image={
                      server.banner
                        ? `${MEDIA_URL}${server.banner}`
                        : 'https://source.unsplash.com/random'
                    }
                    alt="Server Image"
                    sx={{
                      display: { xs: 'none', sm: 'block' },
                      objectFit: 'cover',
                      height: '200px',
                      width: '100%',
                    }} // Hide image on mobile
                  />
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      p: 0,
                      '&:last-child': { paddingBottom: 0 },
                    }}
                  >
                    <List>
                      <ListItem disablePadding>
                        <ListItemIcon sx={{ minWidth: 0 }}>
                          <ListItemAvatar sx={{ minWidth: '50px' }}>
                            <Avatar
                              alt="Server Icon"
                              src={`${MEDIA_URL}${server.icon}`}
                            />
                          </ListItemAvatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 700,
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {server.name}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2">
                              {server.categories
                                .map((category) =>
                                  CapitalizeFirstLetter(category)
                                )
                                .join(',')}
                            </Typography>
                          }
                        ></ListItemText>
                      </ListItem>
                    </List>
                  </CardContent>
                </Link>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </React.Fragment>
  );
};

export default ExploreServers;
