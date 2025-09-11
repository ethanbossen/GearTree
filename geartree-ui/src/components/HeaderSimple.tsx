import { useState } from "react";
import { Burger, Container, Group, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import geartreeLogo from "../assets/GearTreeLogo.svg";
import classes from "./HeaderSimple.module.css";

const links = [
  { link: "/artists", label: "Artists" },
  { link: "/guitars", label: "Guitarists" },
  { link: "/amplifiers", label: "Amplifiers" },
  { link: "/home", label: "Home" },
];

export function HeaderSimple() {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(e) => {
        e.preventDefault();
        setActive(link.link);
      }}
    >
      {link.label}
    </a>
  ));

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <a href="/home" style={{ textDecoration: 'none' }}>
        <div className={classes.logoSection}>
          <img src={geartreeLogo} alt="GearTree" style={{ height: 40,  marginTop: 10}} />
          <span className={classes.brandText}>GearTree</span>
        </div>
        </a>
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
}