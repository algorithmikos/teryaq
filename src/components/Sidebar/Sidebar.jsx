import React, { useEffect } from "react";
import "./Sidebar.css";

import List from "@mui/material/List";
import Divider from "@mui/material/Divider";

import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { Link, useLocation } from "react-router-dom";

import LunchDiningIcon from "@mui/icons-material/LunchDining";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import TimerOffIcon from "@mui/icons-material/TimerOff";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from "@mui/icons-material/Info";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import ScaleIcon from "@mui/icons-material/Scale";
import HomeIcon from "@mui/icons-material/Home";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import Nav from "../Nav/Nav";

export default function Sidebar() {
  const location = useLocation();

  const dosesData = [
    { text: "الرئيسة", link: "/", icon: <HomeIcon /> },
    { text: "جرعة الطعام", link: "/eating-dose", icon: <LunchDiningIcon /> },
    {
      text: "جرعة التصحيح",
      link: "/correction-dose",
      icon: <AutoFixHighIcon />,
    },
    { text: "جرعة النسيان", link: "/base-dose", icon: <TimerOffIcon /> },
  ];

  const settingsData = [
    { text: "الإعدادات", link: "/settings", icon: <SettingsIcon /> },
    { text: "معلومات", link: "/info", icon: <InfoIcon /> },
    {
      text: "الدليل الغذائي",
      link: "/nutritional-guide",
      icon: <FastfoodIcon />,
    },
    { text: "صنف جديد", link: "/new-item", icon: <AddCircleOutlineIcon /> },
  ];

  const [open, setOpen] = React.useState(false);

  const userData = window.localStorage.getItem("UserData");
  const isSudoUser = JSON.parse(userData).sudo;

  return (
    <Nav open={open} setOpen={setOpen}>
      <List>
        {dosesData.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <Link
              to={item.link}
              className={
                location.pathname === item.link
                  ? "list-item-link active"
                  : "list-item-link"
              }
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.text}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {settingsData.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <Link
              to={item.link}
              className={
                location.pathname === item.link
                  ? "list-item-link active"
                  : "list-item-link"
              }
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
      {isSudoUser && (
        <>
          <Divider />
          <List>
            <ListItem disablePadding sx={{ display: "block" }}>
              <Link
                to={"/admin"}
                className={
                  location.pathname === "/admin"
                    ? "list-item-link active"
                    : "list-item-link"
                }
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <AdminPanelSettingsIcon />
                  </ListItemIcon>

                  <ListItemText
                    primary="لوحة الإدارة"
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          </List>
        </>
      )}
    </Nav>
  );
}
