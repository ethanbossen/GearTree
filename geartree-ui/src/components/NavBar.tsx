import { useState } from "react";
import { Burger, Container, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, useLocation } from "react-router-dom";
import geartreeLogo from "../assets/GearTreeLogo.svg";
import classes from "./NavBar.module.css";

const links = [
  { link: "/artists", label: "Artists" },
  { link: "/guitars", label: "Guitars" },
  { link: "/amplifiers", label: "Amplifiers" },
  { link: "/", label: "Home" },
];

export default function NavBar() {
  const [opened, { toggle }] = useDisclosure(false);
  const location = useLocation();

  const items = links.map((link) => (
    <Link
      key={link.label}
      to={link.link}
      className={classes.link}
      data-active={location.pathname === link.link || undefined}
    >
      {link.label}
    </Link>
  ));

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div className={classes.logoSection}>
            <img src={geartreeLogo} alt="GearTree" style={{ height: 40, marginTop: 10}} />
            <span className={classes.brandText}>GearTree</span>
          </div>
        </Link>
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
}