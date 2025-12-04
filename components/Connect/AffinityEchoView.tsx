"use client";

import AppSidebar from "@/components/Layout/AppSidebar";
import { Zap } from "lucide-react";
import Link from "next/link";
import { Container, Row, Col, Card, Image, Badge } from "react-bootstrap";
import AffinityPingForm from "./AffinityPingForm";

type CurrentUser = { username: string; avatar: string | null; name: string };
type AffinitySuggestion = {
    id: number;
    username: string;
    name: string;
    avatar: string | null;
    affinityScore: number;
    mutualGroups: number;
    mutualFollowers: number;
};

export default function AffinityEchoView({
    currentUser,
    affinitySuggestions
}: {
    currentUser: CurrentUser;
    affinitySuggestions: AffinitySuggestion[];
}) {
    return (
        <Container className="py-4">
            <Row className="g-4">
                <Col lg={3} className="d-none d-lg-block">
                    <div className="sticky-top" style={{ top: "90px" }}>
                        <AppSidebar currentUser={currentUser} activePage="connect" />
                    </div>
                </Col>

                <Col lg={9} md={12}>
                    <h2 className="fw-bold mb-4 d-flex align-items-center gap-2">
                        <Zap size={32} className="text-warning" /> Affinity Echo (Gema Afinitas)
                    </h2>
                    <p className="text-secondary lead mb-5">
                        Temukan koneksi otentik berdasarkan interaksi dan minat bersama. Mekanisme ini anti-swipe dan anti-algoritma dangkal.
                    </p>

                    <Row className="g-4">
                        {affinitySuggestions.map((user) => (
                            <Col md={6} lg={4} key={user.id}>
                                <Card className="h-100 border-0 rounded-4 shadow-lg bg-dark text-center position-relative overflow-hidden">
                                    
                                    {/* Affinity Visualizer */}
                                    <div className="p-4 bg-black position-relative">
                                        {/* Gema Ungu (Proximity/Mutuals) */}
                                        <div 
                                            className="rounded-circle position-absolute top-50 start-50 translate-middle"
                                            style={{ 
                                                width: `${100 + user.mutualFollowers * 20}px`, 
                                                height: `${100 + user.mutualFollowers * 20}px`, 
                                                backgroundColor: 'rgba(124, 58, 237, 0.1)', // Warna Ungu
                                                zIndex: 1
                                            }}
                                        />
                                        {/* Gema Hijau (Affinity/Groups) */}
                                        <div 
                                            className="rounded-circle position-absolute top-50 start-50 translate-middle"
                                            style={{ 
                                                width: `${110 + user.mutualGroups * 10}px`, 
                                                height: `${110 + user.mutualGroups * 10}px`, 
                                                backgroundColor: 'rgba(16, 185, 129, 0.1)', // Warna Hijau
                                                zIndex: 0
                                            }}
                                        />

                                        {/* Avatar */}
                                        <Image
                                            src={user.avatar || "/images/default-avatar.png"}
                                            roundedCircle
                                            width={90}
                                            height={90}
                                            className="bg-black mb-3 position-relative"
                                            style={{ objectFit: "cover", border: "3px solid #7c3aed", zIndex: 2 }}
                                        />
                                        
                                        <Link href={`/profile/${user.username}`} className="text-decoration-none">
                                            <h5 className="fw-bold text-white mb-0 hover-underline">{user.name}</h5>
                                        </Link>
                                        <small className="text-secondary">@{user.username}</small>
                                    </div>

                                    <Card.Body className="pt-0">
                                        <div className="mb-3">
                                            <small className="d-block text-warning fw-bold mb-1">Affinity Score: {(user.affinityScore * 100).toFixed(0)}%</small>
                                            <Badge bg="primary" className="me-2">{user.mutualFollowers} Mutuals</Badge>
                                            <Badge bg="success">{user.mutualGroups} Shared Circles</Badge>
                                        </div>
                                        
                                        <AffinityPingForm targetUserId={user.id} />

                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}