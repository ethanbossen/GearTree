// src/components/Footer.tsx
import { Container, Group, Text, Stack } from "@mantine/core";
import geartreeLogo from "../assets/GearTreeLogo.svg";
import classes from "./Footer.module.css";
import { Link } from "react-router-dom";

export default function Footer() {
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
          <Stack gap="xs">
            <Link to="/artists" className={classes.columnTitle}>
              Artists
            </Link>
            <Link to="/artists/jimi-hendrix" className={classes.subLink}>
              Jimi Hendrix
            </Link>
            <Link to="/artists/eric-clapton" className={classes.subLink}>
              Eric Clapton
            </Link>
            <Link to="/artists/bb-king" className={classes.subLink}>
              B.B. King
            </Link>
          </Stack>

          <Stack gap="xs">
            <Link to="/guitars" className={classes.columnTitle}>
              Guitars
            </Link>
            <Link to="/guitars/stratocaster" className={classes.subLink}>
              Stratocaster
            </Link>
            <Link to="/guitars/les-paul" className={classes.subLink}>
              Les Paul
            </Link>
            <Link to="/guitars/telecaster" className={classes.subLink}>
              Telecaster
            </Link>
          </Stack>

          <Stack gap="xs">
            <Link to="/amplifiers" className={classes.columnTitle}>
              Amplifiers
            </Link>
            <Link to="/amplifiers/marshall" className={classes.subLink}>
              Marshall
            </Link>
            <Link to="/amplifiers/fender" className={classes.subLink}>
              Fender
            </Link>
            <Link to="/amplifiers/vox" className={classes.subLink}>
              Vox
            </Link>
          </Stack>
        </Group>
      </Container>
    </footer>
  );
}
