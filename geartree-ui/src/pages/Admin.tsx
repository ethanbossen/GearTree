import React, { useState, useEffect } from "react";
import { Tabs } from "@mantine/core";
import ArtistsTab from "../components/admin/ArtistsTab";
import GuitarsTab from "../components/admin/GuitarsTab";
import AmpsTab from "../components/admin/AmpsTab";
import LoginButton from "../components/admin/LoginButton";
import { auth, provider } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const ALLOWED_EMAIL = "ethan.bossenbroek@gmail.com"; // your email

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("artists");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserEmail(user ? user.email : null);
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup
  }, []);

  if (loading) return null;

  if (!userEmail) {
    return (
<div className="flex flex-col justify-center items-center p-8 space-y-6 text-center mx-auto my-20 max-w-lg">
  <h2 className="text-xl font-bold">
    Are you supposed to be here?  
    <br />If so, login. If not, pack up and move on buddy.
  </h2>
  <LoginButton onLogin={setUserEmail} />
</div>
  );
  }

  if (userEmail !== ALLOWED_EMAIL) {
    return (
      <div>
        Access Denied
        <button onClick={() => signOut(auth)}>Sign Out</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <Tabs value={activeTab} onChange={(value) => value && setActiveTab(value)}>
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
