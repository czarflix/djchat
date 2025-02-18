import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  ListItemButton,
  useTheme,
} from '@mui/material';
import React, { useEffect } from 'react';
import useCrud from '../../hooks/useCrud';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { MEDIA_URL } from '../../config';
import { Link } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
}

const ExploreCategories: React.FC = () => {
  const { dataCRUD, fetchData, error, isloading } = useCrud<Category>(
    [],
    'category/select/'
  );
  const theme = useTheme();

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Box
        sx={{
          height: 50,
          display: 'flex',
          alignItems: 'center',
          px: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          position: 'sticky',
          top: 0,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Typography>Explore</Typography>
      </Box>
      <List sx={{ width: '100%' }}>
        {dataCRUD.map((category) => (
          <ListItem
            key={category.id}
            disablePadding
            sx={{ display: 'block' }}
            dense={true}
          >
            <Link
              to={`/explore/${category.name.toLowerCase()}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <ListItemButton sx={{ minHeight: 0, justifyContent: 'center' }}>
                <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
                  <ListItemAvatar sx={{ minWidth: '50px' }}>
                    <Avatar
                      alt="Category Icon"
                      src={`${MEDIA_URL}${category.icon}`}
                    />
                  </ListItemAvatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        lineHeight: 1.2,
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {category.name}
                    </Typography>
                  }
                  primaryTypographyProps={{
                    sx: {
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      maxWidth: '100%',
                    },
                  }}
                ></ListItemText>
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default ExploreCategories;
