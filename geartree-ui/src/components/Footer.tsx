import { Container, Group, Text, Stack } from "@mantine/core";
import { Link } from "react-router-dom";
import geartreeLogo from "../assets/GearTreeLogo.svg";
import classes from "./styles/Footer.module.css";
import { useArtists, useGuitars, useAmps } from "../api";

export default function Footer() {
  const { data: artists = [] } = useArtists();
  const { data: guitars = [] } = useGuitars();
  const { data: amps = [] } = useAmps();

  return (
    <footer className={classes.footer}>
      <Container size="xl" className={classes.inner}>
        {/* Logo + Rights */}
        <Stack gap="xs" className={classes.left}>
          <Group>
            <img src={geartreeLogo} alt="GearTree Logo" className={classes.logo} />
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

        {/* Desktop Links */}
        <Group gap="5rem" className={`${classes.links} hidden md:flex`}>
          {/* Artists */}
          <Stack gap="xs">
            <Link to="/artists" className={classes.columnTitle}>Artists</Link>
            {artists.slice(0, 3).map((artist) => (
              <Link key={artist.id} to={`/artists/${artist.id}`} className={classes.subLink}>
                {artist.name}
              </Link>
            ))}
          </Stack>

          {/* Guitars */}
          <Stack gap="xs">
            <Link to="/guitars" className={classes.columnTitle}>Guitars</Link>
            {guitars.slice(0, 3).map((guitar) => (
              <Link key={guitar.id} to={`/guitars/${guitar.id}`} className={classes.subLink}>
                {guitar.name}
              </Link>
            ))}
          </Stack>

          {/* Amplifiers */}
          <Stack gap="xs">
            <Link to="/amplifiers" className={classes.columnTitle}>Amplifiers</Link>
            {amps.slice(0, 3).map((amp) => (
              <Link key={amp.id} to={`/amplifiers/${amp.id}`} className={classes.subLink}>
                {amp.name}
              </Link>
            ))}
          </Stack>
        </Group>

        {/* Mobile Links */}
        <Stack gap="xs" className="flex md:hidden mt-4">
          <Link to="/artists" className={classes.columnTitle}>Artists</Link>
          <Link to="/guitars" className={classes.columnTitle}>Guitars</Link>
          <Link to="/amplifiers" className={classes.columnTitle}>Amplifiers</Link>
        </Stack>
      </Container>
    </footer>
  );
}
