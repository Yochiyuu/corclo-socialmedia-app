"use client";
import { useTheme } from "next-themes";
import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Aurora from "../ui/AuroraBackground";

export default function Hero() {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <section
        id="hero"
        className="position-relative vh-100 w-100 overflow-hidden"
        style={{ paddingTop: "100px", minHeight: "100vh" }}
      />
    );
  }

  const textColorClass = theme === "dark" ? "text-white" : "text-dark";
  const textSecondaryColorClass =
    theme === "dark" ? "text-white-50" : "text-muted";
  const outlineButtonVariant =
    theme === "dark" ? "outline-light" : "outline-dark";

  return (
    <section
      id="hero"
      className="position-relative vh-100 w-100 overflow-hidden"
      style={{ paddingTop: "100px" }}
    >
      <div className="position-absolute top-0 start-0 end-0 bottom-0 z-0 bg-body">
        <Aurora />
      </div>

      <Container
        as="div"
        className="position-relative z-1 d-flex h-100 align-items-center py-5"
      >
        <Row className="justify-content-center w-100">
          <Col lg={7} md={8} className="text-center text-md-start">
            <h1
              className={`display-3 fw-bold ${textColorClass}`}
              style={{ fontSize: "4.5rem", lineHeight: "1.1" }}
            >
              <span className="text-primary"></span>Corclo
              <br />
              Social Media, Rebuilt for
              <br /> <span className="text-primary">Humans.</span>
            </h1>
          </Col>

          <Col lg={5} md={8} className="text-center text-md-start mt-5 mt-lg-0">
            <p className={`fs-5 ${textSecondaryColorClass} pe-lg-5`}>
              <span className="text-primary"></span> A platform built for real
              connection, not clout. Post freely, connect deeply, and build your
              own vibe without the noise.
            </p>

            <div className="d-flex flex-column flex-sm-row align-items-center justify-content-center justify-content-md-start gap-3 mt-4">
              <Button
                variant="primary"
                size="lg"
                className="rounded-pill px-5 py-3 d-flex align-items-center gap-2"
              >
                Get Started
              </Button>

              <Button
                variant={outlineButtonVariant}
                size="lg"
                className="rounded-pill px-5 py-3"
              >
                Learn More
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
