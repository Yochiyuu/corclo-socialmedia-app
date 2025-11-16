"use client";

import { Bell, Home, MessageSquare, User } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import React from "react";
import { Container, Form, Nav, Navbar } from "react-bootstrap";
import { ThemeToggle } from "../ThemeToggle";

export default function AppHeader() {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Navbar
      sticky="top"
      expand="lg"
      className="bg-body border-bottom"
      style={{
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        backgroundColor:
          theme === "dark" ? "rgba(0,0,0,0.7)" : "rgba(248, 247, 250, 0.7)",
      }}
    >
      <Container>
        <Navbar.Brand as={Link} href="/home" className="fw-bold">
          Corclo
        </Navbar.Brand>

        <div className="d-none d-md-flex flex-grow-1 justify-content-center px-4">
          <Form className="w-100" style={{ maxWidth: "400px" }}>
            <Form.Control
              type="search"
              placeholder="Search..."
              className="rounded-pill"
            />
          </Form>
        </div>

        <Nav className="ms-auto d-flex flex-row align-items-center gap-3">
          <Nav.Link as={Link} href="/home" title="Home">
            <Home size={22} />
          </Nav.Link>
          <Nav.Link as={Link} href="/messages" title="Messages">
            <MessageSquare size={22} />
          </Nav.Link>
          <Nav.Link as={Link} href="/notifications" title="Notifications">
            <Bell size={22} />
          </Nav.Link>
          <Nav.Link as={Link} href="/profile/me" title="Profile">
            <User size={22} />
          </Nav.Link>

          <div className="vr d-none d-lg-block mx-2" />

          <ThemeToggle />
        </Nav>
      </Container>
    </Navbar>
  );
}
