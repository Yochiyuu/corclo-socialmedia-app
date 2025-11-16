"use client";
import { MessageSquare, Shield, Users } from "lucide-react";
import { Card, Col, Container, Row } from "react-bootstrap";

export default function Features() {
  return (
    <section id="features" className="bg-body py-5">
      <Container style={{ maxWidth: "960px" }}>
        <div className="text-center">
          <h2 className="display-5 fw-bold text-body">
            Built on Connection, Trust, and Chat
          </h2>
          <p className="fs-5 text-body-secondary mt-3">
            Corclo is designed around three core pillars to make your digital
            experience better.
          </p>
        </div>

        <Row className="mt-5 g-4">
          <Col md={4}>
            <Card className="border-0 p-3 feature-card-glass h-100">
              <Card.Body className="text-start">
                <div
                  className="rounded-circle p-3 d-inline-flex"
                  style={{ backgroundColor: "var(--bs-primary-bg-subtle)" }}
                >
                  <Users className="text-primary" size={32} />
                </div>
                <h3 className="fs-4 fw-semibold mt-4 text-body">
                  Genuine Connection
                </h3>
                <Card.Text className="text-body-secondary mt-2">
                  Find communities that truly align with your unique interests
                  and passions. Built for depth, not fleeting trends.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="border-0 p-3 feature-card-glass h-100">
              <Card.Body className="text-start">
                <div
                  className="rounded-circle p-3 d-inline-flex"
                  style={{ backgroundColor: "var(--bs-danger-bg-subtle)" }}
                >
                  <Shield className="text-danger" size={32} />
                </div>
                <h3 className="fs-4 fw-semibold mt-4 text-body">
                  Privacy First
                </h3>
                <Card.Text className="text-body-secondary mt-2">
                  Your safety is our priority. Control your data with robust,
                  granular privacy settings and security features.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="border-0 p-3 feature-card-glass h-100">
              <Card.Body className="text-start">
                <div
                  className="rounded-circle p-3 d-inline-flex"
                  style={{ backgroundColor: "var(--bs-success-bg-subtle)" }}
                >
                  <MessageSquare className="text-success" size={32} />
                </div>
                <h3 className="fs-4 fw-semibold mt-4 text-body">
                  Integrated Messaging
                </h3>
                <Card.Text className="text-body-secondary mt-2">
                  Chat instantly with friends or community members with our
                  powerful, built-in, real-time messenger.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
