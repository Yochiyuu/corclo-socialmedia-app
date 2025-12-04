"use client";

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
            <Row className="g-4 justify-content-center">
                
                <Col lg={10} md={12}>
                    <h2 className="fw-bold mb-4 d-flex align-items-center gap-2 border-bottom border-secondary border-opacity-25 pb-3">
                        <Zap size={32} className="text-warning" /> Affinity Echo (Gema Afinitas)
                    </h2>
                    <p className="text-secondary lead mb-5">
                        Temukan koneksi otentik berdasarkan interaksi dan minat bersama. Desain anti-algoritma.
                    </p>

                    <Row className="g-4">
                        {affinitySuggestions.map((user) => (
                            <Col md={6} lg={4} key={user.id}>
                                <Card className="h-100 border-secondary border-opacity-25 rounded-4 shadow-lg bg-dark text-center position-relative overflow-hidden">
                                    
                                    {/* Affinity Visualizer */}
                                    <div className="p-4 bg-dark position-relative" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                        {/* Gema Ungu (Proximity/Mutuals) */}
                                        <div 
                                            className="rounded-circle position-absolute top-50 start-50 translate-middle animate-pulse-slow"
                                            style={{ 
                                                width: `${80 + user.mutualFollowers * 30}px`,
                                                height: `${80 + user.mutualFollowers * 30}px`, 
                                                backgroundColor: 'rgba(124, 58, 237, 0.1)', 
                                                transition: 'all 0.5s ease',
                                                zIndex: 1
                                            }}
                                        />

                                        {/* Avatar */}
                                        <Image
                                            src={user.avatar || "/images/default-avatar.png"}
                                            roundedCircle
                                            width={100}
                                            height={100}
                                            className="bg-black mb-3 position-relative"
                                            style={{ objectFit: "cover", border: "4px solid #7c3aed", zIndex: 2 }}
                                        />
                                        
                                        <Link href={`/profile/${user.username}`} className="text-decoration-none">
                                            <h5 className="fw-bold text-white mb-0 hover-underline">{user.name}</h5>
                                        </Link>
                                        <small className="text-secondary">@{user.username}</small>
                                    </div>

                                    <Card.Body className="pt-3">
                                        <div className="mb-3">
                                            <small className="d-block text-warning fw-bold mb-2">Affinity Score: {(user.affinityScore * 100).toFixed(0)}%</small>
                                            <Badge pill bg="primary" className="me-2 px-3 py-2 fw-normal">{user.mutualFollowers} Mutuals</Badge>
                                            <Badge pill bg="success" className="px-3 py-2 fw-normal">{user.mutualGroups} Shared Circles</Badge>
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