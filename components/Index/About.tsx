"use client";

import {
  ArrowDownLeft,
  FileText,
  Lock,
  MoreHorizontal,
  Send,
  UserCircle,
} from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

export default function About() {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <section id="about" style={{ minHeight: "100vh" }} />;
  }

  const textBodyColor = "text-body";
  const textMutedColor = "text-body-secondary";
  const cardBgColor = "var(--bs-card-bg)";
  const subtleBgColor = "var(--bs-body-tertiary)";
  const primaryColor = "text-primary";

  return (
    <section id="about" className="bg-body py-5">
      <Container className="py-5">
        <Row className="align-items-center justify-content-center g-5 mb-5 pb-5">
          <Col
            lg={6}
            className="d-flex align-items-center justify-content-center"
          >
            <div
              className="shadow-lg"
              style={{
                width: "280px",
                borderRadius: "2rem",
                background: "#222",
                padding: "10px",
                transform: "rotate(-3deg)",
              }}
            >
              <Card
                className="border-0"
                style={{
                  borderRadius: "1.5rem",
                  background: cardBgColor,
                  overflow: "hidden",
                }}
              >
                <div
                  className="w-100 d-flex justify-content-center"
                  style={{ paddingTop: "10px" }}
                >
                  <div
                    style={{
                      width: "80px",
                      height: "20px",
                      background: "#222",
                      borderRadius: "0 0 10px 10px",
                    }}
                  />
                </div>

                <Card.Header
                  className={`d-flex align-items-center justify-content-between bg-transparent border-0 pt-3 px-3 ${textBodyColor}`}
                >
                  <div className="d-flex align-items-center gap-2">
                    <UserCircle size={28} className={primaryColor} />
                    <strong>Corclo User</strong>
                  </div>
                  <MoreHorizontal size={20} className={textMutedColor} />
                </Card.Header>

                <Card.Body className="text-center pt-2">
                  <p className={`mb-0 ${textMutedColor}`}>Community Score</p>
                  <h1 className={`fw-bold ${textBodyColor}`}>1,558</h1>
                </Card.Body>

                <Card.Footer
                  className="border-0 pb-3 px-3"
                  style={{ backgroundColor: subtleBgColor }}
                >
                  <Row className="text-center g-2">
                    <Col>
                      <Button
                        variant="light"
                        className="rounded-circle p-2"
                        style={{
                          backgroundColor: "var(--bs-body-bg)",
                        }}
                      >
                        <Send size={20} className={primaryColor} />
                      </Button>
                      <p
                        className={`${textBodyColor} small mt-1 mb-0`}
                        style={{ fontSize: "0.75rem" }}
                      >
                        Post
                      </p>
                    </Col>
                    <Col>
                      <Button
                        variant="light"
                        className="rounded-circle p-2"
                        style={{
                          backgroundColor: "var(--bs-body-bg)",
                        }}
                      >
                        <ArrowDownLeft size={20} className={primaryColor} />
                      </Button>
                      <p
                        className={`${textBodyColor} small mt-1 mb-0`}
                        style={{ fontSize: "0.75rem" }}
                      >
                        Reply
                      </p>
                    </Col>
                    <Col>
                      <Button
                        variant="light"
                        className="rounded-circle p-2"
                        style={{
                          backgroundColor: "var(--bs-body-bg)",
                        }}
                      >
                        <FileText size={20} className={primaryColor} />
                      </Button>
                      <p
                        className={`${textBodyColor} small mt-1 mb-0`}
                        style={{ fontSize: "0.75rem" }}
                      >
                        Drafts
                      </p>
                    </Col>
                    <Col>
                      <Button
                        variant="light"
                        className="rounded-circle p-2"
                        style={{
                          backgroundColor: "var(--bs-body-bg)",
                        }}
                      >
                        <MoreHorizontal size={20} className={primaryColor} />
                      </Button>
                      <p
                        className={`${textBodyColor} small mt-1 mb-0`}
                        style={{ fontSize: "0.75rem" }}
                      >
                        More
                      </p>
                    </Col>
                  </Row>
                </Card.Footer>
              </Card>
            </div>
          </Col>

          <Col lg={6}>
            <h5 className={`${primaryColor} fw-bold`}>Our Vision</h5>
            <h2 className={`display-5 fw-bold ${textBodyColor}`}>
              Creating a Positive & Connected Social Space
            </h2>
            <p className={`fs-5 ${textMutedColor} mt-3`}>
              We empower individuals to build genuine communities. Our goal is
              to create a world where managing your digital connections feels
              simple, safe, and accessible to everyone.
            </p>
          </Col>
        </Row>

        <Row className="align-items-center justify-content-center g-5 mb-5 pb-5">
          <Col lg={6} md={8} className="order-lg-2">
            <div
              className="d-flex justify-content-center align-items-center rounded-5"
              style={{ minHeight: "300px", backgroundColor: subtleBgColor }}
            >
              <div
                className="p-5 rounded-4 d-inline-block"
                style={{ backgroundColor: "var(--bs-primary-bg-subtle)" }}
              >
                <Lock size={60} className={primaryColor} />
              </div>
            </div>
          </Col>
          <Col lg={6} md={8} className="order-lg-1">
            <h5 className={`${primaryColor} fw-bold`}>Our Mission</h5>
            <h2 className={`display-5 fw-bold ${textBodyColor}`}>
              Empowering Connection with Safety & Privacy
            </h2>
            <p className={`fs-5 ${textMutedColor} mt-3`}>
              We aim to build tools that give users clarity and control over
              their data while promoting trust and innovation.
            </p>
          </Col>
        </Row>

        <Row className="text-center g-4">
          <Col md={3} sm={6}>
            <h2 className={`display-3 fw-bold ${textBodyColor}`}>99.9%</h2>
            <p className={textMutedColor}>Server Uptime</p>
          </Col>
          <Col md={3} sm={6}>
            <h2 className={`display-3 fw-bold ${textBodyColor}`}>1.2M+</h2>
            <p className={textMutedColor}>Connections Made</p>
          </Col>
          <Col md={3} sm={6}>
            <h2 className={`display-3 fw-bold ${textBodyColor}`}>85%</h2>
            <p className={textMutedColor}>User Satisfaction</p>
          </Col>
          <Col md={3} sm={6}>
            <h2 className={`display-3 fw-bold ${textBodyColor}`}>50K+</h2>
            <p className={textMutedColor}>Active Users</p>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
