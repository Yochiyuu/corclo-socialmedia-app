"use client";

import { loginUser } from "@/app/actions";
import { ArrowRight, Globe, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { Alert, Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginUser, null);

  return (
    <div className="min-vh-100 d-flex overflow-hidden bg-black text-white">
      <Row className="flex-fill g-0">
        <Col lg={7} className="d-none d-lg-block position-relative bg-dark overflow-hidden">
            <div
                className="position-absolute w-100 h-100"
                style={{
                    backgroundImage: "url('/images/index/web3.png')", 
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.6,
                    filter: "grayscale(20%)"
                }}
            />
            <div className="position-absolute w-100 h-100"
                 style={{
                     background: "linear-gradient(135deg, rgba(124, 58, 237, 0.85) 0%, rgba(5, 5, 5, 0.95) 100%)",
                     zIndex: 1
                 }}
            />

            <div className="position-relative h-100 d-flex flex-column justify-content-between p-5" style={{ zIndex: 2 }}>
                <div className="d-flex align-items-center gap-3">
                     <div className="p-2 rounded-3 bg-white bg-opacity-10 text-white border border-white border-opacity-10 backdrop-blur">
                        <Globe size={24} />
                     </div>
                     <span className="fw-bold fs-4 tracking-tight">Corclo.</span>
                </div>

                <div className="mb-5">
                    <h1 className="display-3 fw-bold mb-4 lh-sm">
                        The Social Network <br/>
                        <span className="text-gradient-primary" style={{ 
                            background: "linear-gradient(90deg, #fff 0%, #a78bfa 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}>Built for Humans.</span>
                    </h1>
                    <p className="lead text-white-50" style={{ maxWidth: '550px' }}>
                        Experience a new era of connection without the noise. No algorithm, no tracking, just you and your community.
                    </p>
                </div>

                <div className="d-flex justify-content-between text-white-50 small">
                    <span>© {new Date().getFullYear()} Corclo Inc.</span>
                    <div className="d-flex gap-4">
                        <Link href="#" className="text-white-50 text-decoration-none hover-text-white">Privacy Policy</Link>
                        <Link href="#" className="text-white-50 text-decoration-none hover-text-white">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </Col>

        <Col lg={5} xs={12} className="d-flex align-items-center justify-content-center position-relative bg-black">
             <div className="position-absolute w-100 h-100 d-lg-none" style={{
                 background: "radial-gradient(circle at top right, rgba(124, 58, 237, 0.15), transparent 40%)",
                 zIndex: 0
             }} />

             <Container className="p-4 p-md-5 position-relative" style={{ maxWidth: "480px", zIndex: 1 }}>
                <div className="mb-5">
                    <h2 className="fw-bold mb-2 display-6">Welcome Back</h2>
                    <p className="text-secondary">Please enter your details to sign in.</p>
                </div>

                {state?.success === false && (
                  <Alert variant="danger" className="py-2 small mb-4 border-0 bg-danger bg-opacity-10 text-danger rounded-3 d-flex align-items-center gap-2">
                    <span className="fw-bold">Error:</span> {state.message}
                  </Alert>
                )}

                <form action={formAction}>
                  <Form.Group className="mb-4">
                    <Form.Label className="small text-secondary fw-bold ms-1" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>EMAIL ADDRESS</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-dark border-end-0 border-secondary border-opacity-25 text-secondary rounded-start-pill ps-3">
                        <Mail size={18} />
                      </InputGroup.Text>
                      <Form.Control
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        required
                        className="bg-dark border-start-0 border-secondary border-opacity-25 text-white rounded-end-pill py-2 shadow-none"
                        style={{ borderLeft: 'none' }}
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="small text-secondary fw-bold ms-1" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>PASSWORD</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-dark border-end-0 border-secondary border-opacity-25 text-secondary rounded-start-pill ps-3">
                        <Lock size={18} />
                      </InputGroup.Text>
                      <Form.Control
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        className="bg-dark border-start-0 border-secondary border-opacity-25 text-white rounded-end-pill py-2 shadow-none"
                        style={{ borderLeft: 'none' }}
                      />
                    </InputGroup>
                    <div className="text-end mt-2">
                        <Link href="#" className="text-decoration-none small text-secondary hover-text-white transition-all">
                            Forgot password?
                        </Link>
                    </div>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isPending}
                    className="w-100 py-3 fw-bold rounded-pill d-flex align-items-center justify-content-center gap-2 shadow-lg mt-2"
                    style={{
                        background: "linear-gradient(90deg, #7c3aed 0%, #6d28d9 100%)",
                        border: "none"
                    }}
                  >
                    {isPending ? "Signing in..." : "Sign In"} <ArrowRight size={18} />
                  </Button>
                </form>

                <div className="text-center mt-5 pt-3 border-top border-secondary border-opacity-10">
                  <span className="text-secondary small">Don't have an account? </span>
                  <Link href="/register" className="text-decoration-none fw-bold text-primary hover-opacity">
                    Create an account
                  </Link>
                </div>
             </Container>
        </Col>
      </Row>
    </div>
  );
}