"use client";

import { ArrowRight, CheckCircle } from "lucide-react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";

export default function About() {
  const features = [
    "Tanpa Algoritma Tersembunyi",
    "Privasi Data Terjamin (End-to-End)",
    "Kustomisasi Tampilan Sepuasnya",
  ];

  return (
    <section
      id="about"
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

      <Container className="position-relative py-5" style={{ zIndex: 1 }}>
        <Row className="align-items-center">
          <Col lg={6} className="mb-5 mb-lg-0 position-relative">
            <div
              className="position-absolute top-50 start-50 translate-middle"
              style={{
                width: "80%",
                height: "80%",
                background:
                  "radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, rgba(0,0,0,0) 70%)",
                filter: "blur(60px)",
                zIndex: -1,
              }}
            />

            <div
              className="p-2 rounded-4 border border-secondary border-opacity-25"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Image
                src="/images/index/nextjs.jpg"
                alt="About Corclo"
                fluid
                className="rounded-4 shadow-lg w-100"
                style={{
                  objectFit: "cover",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
            </div>
          </Col>

          <Col lg={6} className="ps-lg-5">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill border border-primary border-opacity-25 bg-primary bg-opacity-10 mb-3">
              <span className="text-primary small fw-bold text-uppercase tracking-wide">
                About Us
              </span>
            </div>

            <h2 className="display-5 fw-bold mb-4">
              Kenapa Memilih <br />
              <span
                style={{
                  background:
                    "linear-gradient(90deg, #a78bfa 0%, #e879f9 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Corclo?
              </span>
            </h2>

            <p className="text-secondary lead mb-5">
              Kami percaya media sosial seharusnya mendekatkan, bukan memecah
              belah. Corclo hadir dengan privasi terjamin dan kontrol penuh di
              tanganmu.
            </p>

            <div className="d-flex flex-column gap-4 mb-5">
              {features.map((item, index) => (
                <div key={index} className="d-flex align-items-start gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor: "rgba(124, 58, 237, 0.1)",
                      color: "#a78bfa",
                    }}
                  >
                    <CheckCircle size={18} />
                  </div>
                  <div>
                    <span className="fs-5 fw-medium text-white">{item}</span>
                    <p className="mb-0 text-secondary small opacity-75">
                      Menghadirkan pengalaman sosial yang lebih otentik.
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              href="#"
              size="lg"
              className="px-5 py-3 fw-bold rounded-pill d-inline-flex align-items-center gap-2 shadow-lg border-0"
              style={{
                background: "linear-gradient(90deg, #7c3aed 0%, #6d28d9 100%)",
                boxShadow: "0 0 20px rgba(124, 58, 237, 0.3)",
              }}
            >
              Pelajari Filosofi Kami <ArrowRight size={20} />
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
