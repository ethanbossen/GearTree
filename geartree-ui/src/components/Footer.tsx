// src/components/Footer.tsx
import { useEffect, useState } from "react";
import { Container, Group, Text, Stack } from "@mantine/core";
import { Link } from "react-router-dom";
import geartreeLogo from "../assets/GearTreeLogo.svg";
import classes from "./Footer.module.css";
import { fetchArtists, fetchGuitars, fetchAmps } from "../api";

export default function Footer() {
  const [artists, setArtists] = useState<any[]>([]);
  const [guitars, setGuitars] = useState<any[]>([]);
  const [amps, setAmps] = useState<any[]>([]);

  useEffect(() => {
    fetchArtists().then(setArtists).catch(console.error);
    fetchGuitars().then(setGuitars).catch(console.error);
    fetchAmps().then(setAmps).catch(console.error);
  }, []);

  return (
    <footer className={classes.footer}>
      <Container size="lg" className={classes.inner}>
        {/* Left side with logo and rights */}
        <Stack gap="xs" className={classes.left}>
          <Group>
            <img
              src={geartreeLogo}
              alt="GearTree Logo"
              className={classes.logo}
            />
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <Text fw={700} size="xl" className={classes.brand}>
                GearTree
              </Text>
            </Link>
          </Group>
          <Text size="sm" c="dimmed">
            © {new Date().getFullYear()} GearTree. All rights reserved.
          </Text>
        </Stack>

        {/* Link columns */}
        <Group gap="5rem" className={classes.links}>
          {/* Artists */}
          <Stack gap="xs">
            <Link to="/artists" className={classes.columnTitle}>
              Artists
            </Link>
            {artists.slice(0, 3).map((artist) => (
              <Link
                key={artist.id}
                to={`/artists/${artist.id}`}
                className={classes.subLink}
              >
                {artist.name}
              </Link>
            ))}
          </Stack>

          {/* Guitars */}
          <Stack gap="xs">
            <Link to="/guitars" className={classes.columnTitle}>
              Guitars
            </Link>
            {guitars.slice(0, 3).map((guitar) => (
              <Link
                key={guitar.id}
                to={`/guitars/${guitar.id}`}
                className={classes.subLink}
              >
                {guitar.name}
              </Link>
            ))}
          </Stack>

          {/* Amplifiers */}
          <Stack gap="xs">
            <Link to="/amplifiers" className={classes.columnTitle}>
              Amplifiers
            </Link>
            {amps.slice(0, 3).map((amp) => (
              <Link
                key={amp.id}
                to={`/amplifiers/${amp.id}`}
                className={classes.subLink}
              >
                {amp.name}
              </Link>
            ))}
          </Stack>
        </Group>
      </Container>
    </footer>
  );
}
