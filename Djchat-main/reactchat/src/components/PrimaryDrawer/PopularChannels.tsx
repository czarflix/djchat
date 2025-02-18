import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  ListItemButton,
} from '@mui/material';
import React, { useEffect } from 'react';
import useCrud from '../../hooks/useCrud';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { MEDIA_URL } from '../../config';
import { Link } from 'react-router-dom';
import { CapitalizeFirstLetter } from '../../helpers/utils';
interface Server {
  id: number;
  name: string;
  categories: Array<string>;
  icon: string;
}

type Props = {
  open: boolean;
};

const PopularChannels: React.FC<Props> = ({ open }) => {
  const { dataCRUD, fetchData, error, isloading } = useCrud<Server>(
    [],
    'server/select/'
  );

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log(dataCRUD);
  }, [dataCRUD]);

  return (
    <>
      <Box
        sx={{
          height: 50,
          p: 2,
          display: 'flex',
          alignContent: 'center',
          flex: '1 1 100%',
          // backgroundColor: "blue",
        }}
      >
        <Typography sx={{ display: open ? 'block' : 'none' }}>
          Popular
        </Typography>
      </Box>
      <List sx={{ width: '100%' }}>
        {dataCRUD.map((server) => (
          <ListItem
            key={server.id}
            disablePadding
            sx={{ display: 'block' }}
            dense={true}
          >
            <Link
              to={`/server/${server.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <ListItemButton sx={{ minHeight: 0, justifyContent: 'center' }}>
                <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
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
                        lineHeight: 1.2,
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {server.name}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 400,
                        lineHeight: 1.2,
                        color: 'textSecondary',
                      }}
                    >
                      {server.categories
                        .map((category) => CapitalizeFirstLetter(category))
                        .join(',')}
                    </Typography>
                  }
                  sx={{ opacity: open ? 1 : 0 }}
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

export default PopularChannels;
