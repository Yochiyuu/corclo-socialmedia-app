"use client";

import { registerUser } from "@/app/actions";
import { ArrowRight, AtSign, Globe, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { Alert, Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerUser, null);

  return (
    <div className="min-vh-100 d-flex overflow-hidden bg-black text-white">
      <Row className="flex-fill g-0">
        <Col lg={7} className="d-none d-lg-block position-relative bg-dark overflow-hidden">
            <div
                className="position-absolute w-100 h-100"
                style={{
                    backgroundImage: "url('/images/index/esport.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.5,
                    filter: "grayscale(30%) contrast(1.2)"
                }}
            />
            <div className="position-absolute w-100 h-100"
                 style={{
                     background: "linear-gradient(135deg, rgba(5, 5, 5, 0.9) 0%, rgba(124, 58, 237, 0.8) 100%)",
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
                        Join the <br/>
                        <span className="text-gradient-gold" style={{ 
                            background: "linear-gradient(90deg, #fcd34d 0%, #f59e0b 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}>Revolution.</span>
                    </h1>
                    <p className="lead text-white-50" style={{ maxWidth: '550px' }}>
                        Create your account today and start connecting with people who share your passion, without the noise.
                    </p>
                </div>

                <div className="d-flex justify-content-between text-white-50 small">
                    <span>© {new Date().getFullYear()} Corclo Inc.</span>
                    <div className="d-flex gap-4">
                        <Link href="#" className="text-white-50 text-decoration-none hover-text-white">Community Guidelines</Link>
                    </div>
                </div>
            </div>
        </Col>

        <Col lg={5} xs={12} className="d-flex align-items-center justify-content-center position-relative bg-black">
             <div className="position-absolute w-100 h-100 d-lg-none" style={{
                 background: "radial-gradient(circle at bottom left, rgba(245, 158, 11, 0.1), transparent 40%)",
                 zIndex: 0
             }} />

             <Container className="p-4 p-md-5 position-relative" style={{ maxWidth: "520px", zIndex: 1 }}>
                <div className="mb-4">
                    <h2 className="fw-bold mb-2 display-6">Create Account</h2>
                    <p className="text-secondary">Join the exclusive community today.</p>
                </div>

                {state?.success === false && (
                  <Alert variant="danger" className="py-2 small mb-4 border-0 bg-danger bg-opacity-10 text-danger rounded-3 d-flex align-items-center gap-2">
                    <span className="fw-bold">Error:</span> {state.message}
                  </Alert>
                )}

                <form action={formAction}>
                  <div className="row g-3 mb-3">
                    <Col md={12}>
                        <Form.Group>
                            <Form.Label className="small text-secondary fw-bold ms-1" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>FULL NAME</Form.Label>
                            <InputGroup>
                            <InputGroup.Text className="bg-dark border-end-0 border-secondary border-opacity-25 text-secondary rounded-start-pill ps-3">
                                <User size={18} />
                            </InputGroup.Text>
                            <Form.Control
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                required
                                className="bg-dark border-start-0 border-secondary border-opacity-25 text-white rounded-end-pill py-2 shadow-none"
                                style={{ borderLeft: 'none' }}
                            />
                            </InputGroup>
                        </Form.Group>
                    </Col>
                  </div>

                  <Form.Group className="mb-3">
                    <Form.Label className="small text-secondary fw-bold ms-1" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>USERNAME</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-dark border-end-0 border-secondary border-opacity-25 text-secondary rounded-start-pill ps-3">
                        <AtSign size={18} />
                      </InputGroup.Text>
                      <Form.Control
                        name="username"
                        type="text"
                        placeholder="johndoe"
                        required
                        className="bg-dark border-start-0 border-secondary border-opacity-25 text-white rounded-end-pill py-2 shadow-none"
                        style={{ borderLeft: 'none' }}
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3">
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
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isPending}
                    className="w-100 py-3 fw-bold rounded-pill d-flex align-items-center justify-content-center gap-2 shadow-lg mt-2"
                    style={{
                        background: "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)",
                        border: "none",
                        color: "white"
                    }}
                  >
                    {isPending ? "Creating account..." : "Sign Up Free"} <ArrowRight size={18} />
                  </Button>
                </form>

                <div className="text-center mt-5 pt-3 border-top border-secondary border-opacity-10">
                  <span className="text-secondary small">Already have an account? </span>
                  <Link href="/login" className="text-decoration-none fw-bold text-warning hover-opacity">
                    Log In
                  </Link>
                </div>
             </Container>
        </Col>
      </Row>
    </div>
  );
}