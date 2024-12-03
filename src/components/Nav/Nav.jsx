import * as React from "react";
import "./Nav.css";

import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { Routes, Route, useNavigate } from "react-router-dom";

import Settings from "../../pages/Settings/Settings";
import Guide from "../../pages/Guide/Guide";
import EatingDose from "../../pages/EatingDose/EatingDose";
import OmissionDose from "../../pages/OmissionDose/OmissionDose";
import Footer from "../Footer/Footer";
import { Button, Grid } from "@mui/material";
import CorrectionDose from "../../pages/CorrectionDose/CorrectionDose";
import Info from "../../pages/Info/Info";
import { useDispatch } from "react-redux";
import { toggleLogin } from "../../rtk/slices/auth-slice";
import { useCookies } from "react-cookie";
import NewItem from "../../pages/Admin/NewItem/NewItem";

import { setUser } from "../../rtk/slices/patient-slice";
import { auth } from "../../firebase.config";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import Injection from "../../../Injection";
import Home from "../../pages/Home/Home";
import Admin from "../../pages/Admin/Admin";

const drawerWidth = 220;

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
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginRight: drawerWidth, // Adjusted from marginLeft to marginRight
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const Nav = ({ open, setOpen, children }) => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(setUser());
  }, []);

  const navigate = useNavigate();
  const theme = useTheme();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Grid container direction="column">
      <Grid item xl={12} sx={{ marginBottom: 20 }}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar position="fixed" open={open}>
            <Toolbar className="toolbar">
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="end"
                sx={{
                  marginLeft: 5, // Adjusted from marginRight to marginLeft
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>

              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>
                  <Grid container alignItems="center">
                    <img src="/potion.png" className="nav-icon" />
                    <Typography variant="h6" noWrap component="div">
                      ترياق
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open} anchor="right">
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            </DrawerHeader>
            <Divider />
            {children}
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1 }}>
            <DrawerHeader />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/eating-dose" element={<EatingDose />} />
              <Route path="/correction-dose" element={<CorrectionDose />} />
              <Route path="/base-dose" element={<OmissionDose />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/info" element={<Info />} />
              <Route path="/nutritional-guide" element={<Guide />} />
              <Route path="/new-item" element={<NewItem />} />
              <Route path="/admin" element={<Admin />} />
              {/* <Route path="/inj" element={<Injection />} /> */}
            </Routes>
          </Box>
        </Box>
      </Grid>

      {/* <Grid item xl={12}>
        <Footer />
      </Grid> */}
    </Grid>
  );
};

export default Nav;
