import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {Outlet, useNavigate} from "react-router-dom";
import { UndoRounded } from '@mui/icons-material';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';



const pages = ['My Feed', 'All Restaurants', 'My Restaurant'];
const settings = ['Sign Up', 'Log in', 'Log out', 'Edit Profile'];

const NavBar = () => {

  const [userInfo, setUserInfo] = React.useState({})

  React.useEffect(() => {
    if (!localStorage.getItem('token')){
        navigate('/signin')
        return
    }
    fetch('http://localhost:8000/accounts/profile/', {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Authorization': 'Bearer '+ localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
        referrerPolicy: 'no-referrer',
    })
    .then(data => data.json())
    .then(res => {
        if (res['user'] !== undefined) {
          setUserInfo(res['user'])
        }
    })
    .catch((error) => console.error('Error:', error));
  }, [])


  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate()

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  }));

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }));

  return (
    <>
    <AppBar style={{'backgroundColor': '#6D1526'}} position="static">
      <Container maxWidth="xxl">
        <Toolbar disableGutters>

          <MenuItem>
          <img src="https://imgur.com/DTy9YB9.png"/>
            <Typography
              fontWeight="fontWeightBold"
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
              onClick={() => navigate("/")}
            >RESTIFY</Typography>

          </MenuItem>


          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          <Button
                onClick={() => navigate("/")}
                sx={{ my: 2, color: 'white', display: 'block' }}
          >
          My Feed
          </Button>
          <Button
                onClick={() => navigate("/restaurants")}
                sx={{ my: 2, color: 'white', display: 'block' }}
          >
          All Restaurants
          </Button>

          </Box>

            <Search
            onKeyPress={event => {
              if (event.key === 'Enter') {
                navigate(`/restaurants/search/?query=${event.target.value}&type=name`);
              }
            }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search Name"
              />
            </Search>
            <Search
            onKeyPress={event => {
              if (event.key === 'Enter') {
                navigate(`/restaurants/search/?query=${event.target.value}&type=type`);
              }
            }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search Type"
              />
            </Search>
            <Search
            onKeyPress={event => {
              if (event.key === 'Enter') {
                navigate(`/restaurants/search/?query=${event.target.value}&type=location`);
              }
            }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search Address"
              />
            </Search>

          <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}
          onClick={() => navigate("/notifications/owner")}>
          <MenuItem>
          <IconButton
            size="large"
            color="inherit"
          >
            <Badge color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Owner</p>
        </MenuItem>
        </Box>

        <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}
          onClick={() => navigate("/notifications/user")}>
          <MenuItem>
          <IconButton
            size="large"
            color="inherit"
          >
            <Badge color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>User</p>
        </MenuItem>

        <MenuItem>
        {userInfo.username !== undefined &&
          <Typography style={{marginLeft:'10px'}}>{userInfo.username}</Typography>}
        </MenuItem>

        </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Profile Options">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {userInfo.avatar && <Avatar src={userInfo.avatar} /> }
                {!userInfo.avatar && <Avatar src="https://img.icons8.com/ios-glyphs/90/ffffff/user-male-circle.png" />}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >

                <MenuItem onClick={() => {handleCloseUserMenu();
                                          navigate("/profile")}}>
                  <Typography textAlign="center">Profile Page</Typography>
                </MenuItem>
                { !localStorage.getItem('token')  && <MenuItem onClick={() => {handleCloseUserMenu();
                                          navigate("/signup")}}>
                  <Typography textAlign="center">Sign Up</Typography>
                </MenuItem> }
                { !localStorage.getItem('token') && <MenuItem onClick={() => {
                                    // setLoggedIn(!loggedIn)
                                    navigate("/signin")
                                  }}>
                  <Typography textAlign="center">Sign in</Typography>
                </MenuItem> }
                { localStorage.getItem('token') && <MenuItem onClick={() => {
                                    localStorage.removeItem('token')
                                    // setLoggedIn(!loggedIn)
                                    navigate("/signin")
                                    window.location.reload();
                                  }}>
                  <Typography textAlign="center">Sign out</Typography>
                </MenuItem> }
            </Menu>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
    <Outlet />
    </>
  );
};
export default NavBar;
