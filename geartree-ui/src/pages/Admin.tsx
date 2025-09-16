import React, { useState } from "react";
import { Tabs } from "@mantine/core";

// Your tab components
import ArtistsTab from "../components/admin/ArtistsTab";
import GuitarsTab from "../components/admin/GuitarsTab";
import AmpsTab from "../components/admin/AmpsTab";

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("artists");

  return (
    <div style={{ padding: "2rem" }}>

     <Tabs
  value={activeTab}
  onChange={(value) => value && setActiveTab(value)}
>
  <Tabs.List>
    <Tabs.Tab value="artists">Artists</Tabs.Tab>
    <Tabs.Tab value="guitars">Guitars</Tabs.Tab>
    <Tabs.Tab value="amps">Amps</Tabs.Tab>
  </Tabs.List>

  {activeTab === "artists" && <ArtistsTab />}
  {activeTab === "guitars" && <GuitarsTab />}
  {activeTab === "amps" && <AmpsTab />}
</Tabs>
    </div>
  );
};

export default AdminPage;
