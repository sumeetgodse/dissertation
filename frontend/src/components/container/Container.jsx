import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CloudIcon from "@mui/icons-material/Cloud";
import LockIcon from "@mui/icons-material/Lock";
import AppsIcon from "@mui/icons-material/Apps";
import { useLocation, useNavigate } from "react-router-dom";
import { Chat } from "../chat";
import { Home } from "./Home";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../../axios";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

const logoutUser = async () => {
  const response = await apiClient.post("/api/logout", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const Container = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const location = useLocation();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const { mutate: logout } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      localStorage.clear("loggedInUser");
      navigate("/login");
    },
  });

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Product Catalog
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h7" noWrap component="div">
              {localStorage.getItem("loggedInUser")}
            </Typography>
            <IconButton
              color="inherit"
              aria-label="logout"
              onClick={() => logout()}
              edge="end"
              sx={{
                marginRight: 0,
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {[
            { title: "My Resources", pathname: "resources" },
            { title: "Services", pathname: "services" },
            { title: "Admin", pathname: "admin" },
          ].map((option, index) => (
            <ListItem
              onClick={() => {
                navigate(option.pathname);
              }}
              key={option.title}
              disablePadding
              sx={{
                display: "block",
                ...(location.pathname.includes(option.pathname) && {
                  background: "#e0e0e0",
                }),
              }}
            >
              <ListItemButton
                sx={[
                  { minHeight: 48, px: 2.5 },
                  open
                    ? { justifyContent: "initial" }
                    : { justifyContent: "center" },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: "center",
                    },
                    open ? { mr: 3 } : { mr: "auto" },
                  ]}
                >
                  {index == 0 ? (
                    <CloudIcon />
                  ) : index == 1 ? (
                    <AppsIcon />
                  ) : (
                    <LockIcon />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={option.title}
                  sx={[open ? { opacity: 1 } : { opacity: 0 }]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Home />
        <Chat />
      </Box>
    </Box>
  );
};
