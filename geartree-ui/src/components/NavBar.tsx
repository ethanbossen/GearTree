import { Burger, Container, Group, Collapse } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, useLocation } from "react-router-dom";
import geartreeLogo from "../assets/GearTreeLogo.svg";
import classes from "./styles/NavBar.module.css";
import { useRef } from "react";

const links = [
  { link: "/artists", label: "Artists" },
  { link: "/guitars", label: "Guitars" },
  { link: "/amplifiers", label: "Amplifiers" },
  { link: "/", label: "Home" },
];

export default function NavBar() {
  const [opened, { toggle }] = useDisclosure(false);
  const location = useLocation();
  const burgerRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    toggle();
    if (opened) {
      burgerRef.current?.focus();
    }
  }

  const items = links.map((link) => (
    <Link
      key={link.label}
      to={link.link}
      className={classes.link}
      data-active={location.pathname === link.link || undefined}
      onClick={() => opened && handleToggle()} 
    >
      {link.label}
    </Link>
  ));

  return (
    <header className={classes.header}>
      <Container size="xl" className={classes.inner}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <div className={classes.logoSection}>
            <img src={geartreeLogo} alt="GearTree" style={{ height: 40, marginTop: 10 }} />
            <span className={classes.brandText}>GearTree</span>
          </div>
        </Link>

        {/* Desktop links */}
        <Group gap={5} visibleFrom="sm">
          {items}
        </Group>

        {/* Burger icon (mobile) */}
        <Burger
          opened={opened}
          onClick={toggle}
          hiddenFrom="sm"
          size="md"
          color="var(--brand-purple)"
        />
      </Container>

      {/* Mobile menu */}
      <Collapse in={opened}>
        <div className={classes.mobileMenu}>
          {items.map((item) => (
            <div key={item.key} className={classes.mobileMenuItem}>
              {item}
            </div>
          ))}
        </div>
      </Collapse>
    </header>
  );
}
