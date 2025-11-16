import { Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { Col, Container, Row } from "react-bootstrap";

export default function Footer() {
  return (
    <footer className="bg-body-tertiary border-top py-5">
      <Container style={{ maxWidth: "960px" }}>
        <Row className="gy-4 mb-4">
          <Col lg={4} md={12} className="text-center text-lg-start">
            <h3 className="fs-4 fw-bold text-body">Corclo</h3>
            <p className="text-muted small">
              A new way to connect and share with your communities.
            </p>
          </Col>

          <Col lg={2} md={4} xs={6}>
            <h5 className="fs-6 fw-semibold text-body mb-3">Product</h5>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li>
                <Link href="/" className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="footer-link">
                  About
                </Link>
              </li>
              <li>
                <Link href="/features" className="footer-link">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/community" className="footer-link">
                  Community
                </Link>
              </li>
            </ul>
          </Col>

          <Col lg={3} md={4} xs={6}>
            <h5 className="fs-6 fw-semibold text-body mb-3">Resources</h5>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li>
                <Link href="/support" className="footer-link">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/blog" className="footer-link">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link">
                  Contact
                </Link>
              </li>
            </ul>
          </Col>

          <Col lg={3} md={4} xs={6}>
            <h5 className="fs-6 fw-semibold text-body mb-3">Legal</h5>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li>
                <Link href="/privacy" className="footer-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="footer-link">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </Col>
        </Row>

        <hr className="mb-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div className="text-center text-md-start">
            <p className="text-muted small">
              &copy; {new Date().getFullYear()} Corclo. All rights reserved.
            </p>
          </div>
          <div className="mt-4 mt-md-0 d-flex gap-4">
            <Link href="#" className="footer-link">
              <Twitter size={20} />
            </Link>
            <Link href="#" className="footer-link">
              <Instagram size={20} />
            </Link>
            <Link href="#" className="footer-link">
              <Linkedin size={20} />
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
