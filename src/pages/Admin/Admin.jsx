import React, { useState } from "react";
import "./Admin.css";
import { Tab, Tabs } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import NewCarbItem from "../Guide/NewCarbItem/NewCarbItem";
import NewWeightItem from "../Guide/NewWeightItem/NewWeightItem";

const Admin = () => {
  const [currentTab, setCurrentTab] = useState("add-carb-item");

  return (
    <TabContext value={currentTab}>
      <Tabs
        value={currentTab}
        onChange={(e, newVal) => setCurrentTab(newVal)}
        orientation="vertical"
        variant="scrollable"
      >
        <Tab label="إضافة صنف بالكارب" value="add-carb-item" />
        <Tab label="إضافة صنف بالوزن" value="add-weight-item" />
      </Tabs>

      <TabPanel value="add-carb-item">
        <NewCarbItem />
      </TabPanel>
      <TabPanel value="add-weight-item">
        <NewWeightItem />
      </TabPanel>
    </TabContext>
  );
};

export default Admin;
