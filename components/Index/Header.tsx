"use client";

import { useTheme } from "next-themes";
import React from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { ThemeToggle } from "../ThemeToggle";

const handleScroll = (
  e: React.MouseEvent<HTMLElement, MouseEvent>,
  targetId: string
) => {
  e.preventDefault();
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    window.scrollTo({
      top: targetElement.offsetTop - 80,
      behavior: "smooth",
    });
  }
};

export default function Header() {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="position-fixed w-100 header-pill" style={{ zIndex: 1020 }}>
      <Navbar
        expand="lg"
        variant={theme === "dark" ? "dark" : "light"}
        className="bg-transparent"
      >
        <Container>
          <Navbar.Brand
            as="a"
            href="#hero"
            className="ms-2"
            onClick={(e) => handleScroll(e, "hero")}
          >
            Corclo
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" />

          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto d-flex flex-row align-items-center">
              <Nav.Link
                as="a"
                href="#hero"
                onClick={(e) => handleScroll(e, "hero")}
              >
                Home
              </Nav.Link>
              <Nav.Link
                as="a"
                href="#about"
                onClick={(e) => handleScroll(e, "about")}
              >
                About
              </Nav.Link>
              <Nav.Link
                as="a"
                href="#features"
                onClick={(e) => handleScroll(e, "features")}
              >
                Features
              </Nav.Link>
              <Nav.Link
                as="a"
                href="#community"
                onClick={(e) => handleScroll(e, "community")}
              >
                Community
              </Nav.Link>

              <div className="vr mx-3" />

              <Nav.Link as="a" href="/sign-in">
                Sign In
              </Nav.Link>

              <Button
                as="a"
                href="/sign-up"
                variant="primary"
                className="ms-3 rounded-pill"
                size="sm"
              >
                Sign Up
              </Button>

              <div className="ms-3">
                <ThemeToggle />
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
