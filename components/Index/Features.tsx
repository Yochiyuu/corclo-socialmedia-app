"use client";

import { Globe, Lock, Shield, Smartphone, Smile, Zap } from "lucide-react";
import { Card, Col, Container, Row } from "react-bootstrap";

export default function Features() {
  const features = [
    {
      icon: Shield,
      title: "Secure by Design",
      desc: "Data kamu diamankan dengan enkripsi tingkat militer.",
      color: "#10b981",
      bg: "rgba(16, 185, 129, 0.1)",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      desc: "Loading instan berkat teknologi Next.js terbaru.",
      color: "#8b5cf6",
      bg: "rgba(139, 92, 246, 0.1)",
    },
    {
      icon: Smile,
      title: "User Friendly",
      desc: "Antarmuka yang simpel, bersih, dan mudah digunakan.",
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.1)",
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      desc: "Akses nyaman dari smartphone maupun desktop.",
      color: "#ec4899",
      bg: "rgba(236, 72, 153, 0.1)",
    },
    {
      icon: Globe,
      title: "Global Reach",
      desc: "Server tersebar di seluruh dunia untuk akses cepat.",
      color: "#3b82f6",
      bg: "rgba(59, 130, 246, 0.1)",
    },
    {
      icon: Lock,
      title: "Privacy Focus",
      desc: "Kami tidak menjual data pribadimu ke pihak ketiga.",
      color: "#ef4444",
      bg: "rgba(239, 68, 68, 0.1)",
    },
  ];

  return (
    <section
      id="features"
      className="position-relative py-5 overflow-hidden"
      style={{
        backgroundColor: "#050505",
        color: "white",
      }}
    >
      <div
        className="position-absolute w-100 h-100 top-0 start-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          zIndex: 0,
        }}
      />

      <div
        className="position-absolute top-0 start-50 translate-middle-x"
        style={{
          width: "60%",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(80px)",
          zIndex: 0,
        }}
      />

      <Container className="position-relative py-5" style={{ zIndex: 1 }}>
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill border border-primary border-opacity-25 bg-primary bg-opacity-10 mb-3">
            <span className="text-primary small fw-bold text-uppercase tracking-wide">
              Features
            </span>
          </div>
          <h2 className="display-5 fw-bold mb-3">
            Fitur{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #a78bfa 0%, #e879f9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Unggulan
            </span>
          </h2>
          <p
            className="text-secondary lead mx-auto"
            style={{ maxWidth: "600px" }}
          >
            Semua yang kamu butuhkan untuk bersosialisasi dengan aman dan nyaman
            dalam satu platform.
          </p>
        </div>

        <Row className="g-4">
          {features.map((feature, index) => (
            <Col md={6} lg={4} key={index}>
              <Card
                className="h-100 border border-secondary border-opacity-25 text-white"
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Card.Body className="p-4">
                  <div
                    className="mb-4 d-inline-flex p-3 rounded-3"
                    style={{
                      backgroundColor: feature.bg,
                      color: feature.color,
                    }}
                  >
                    <feature.icon size={28} />
                  </div>
                  <Card.Title className="fw-bold mb-3 fs-4">
                    {feature.title}
                  </Card.Title>
                  <Card.Text className="text-secondary">
                    {feature.desc}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
