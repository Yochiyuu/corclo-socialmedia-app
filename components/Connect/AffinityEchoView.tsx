"use client";

import { Zap, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Container, Row, Col, Card, Image, Badge } from "react-bootstrap";
import AffinityPingForm from "./AffinityPingForm";

// --- KONFIGURASI ECHO ---
const VISUALIZER_CONFIG = {
    CARD_HEIGHT: '175px', // Tinggi container visualizer
    CONTENT_TOP_OFFSET: -10, // Offset Vertikal Akhir (di luar 50%) dalam piksel (menarik ke atas 15px)
    BORDER_RADIUS: '20px', // Custom border radius untuk card visualizer
    AVATAR_SIZE: 90,
};


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

    const getGlowColor = (score: number) => {
        if (score >= 0.7) return 'rgba(124, 58, 237, 0.6)';
        if (score >= 0.6) return 'rgba(16, 185, 129, 0.5)';
        return 'rgba(255, 255, 255, 0.1)';
    };

    return (
        <Container className="py-5 position-relative">
            {/* Decorative Background Elements */}
            <div style={{
                position: 'fixed',
                top: '10%',
                right: '5%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(0,0,0,0) 70%)',
                borderRadius: '50%',
                filter: 'blur(80px)',
                zIndex: -1,
                pointerEvents: 'none'
            }} />

            <Row className="g-4 justify-content-center">

                <Col lg={10} md={12}>
                    {/* --- HEADLINE & BACK LINK --- */}
                    <div className="mb-4">
                        <Link href="/home" className="text-secondary small d-inline-flex align-items-center text-decoration-none hover-text-primary mb-3">
                            <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} /> Kembali ke Home
                        </Link>

                        <div className="glass-header p-4 rounded-4 mb-4">
                            <h2 className="fw-bold d-flex align-items-center gap-3 mb-2">
                                <div className="p-2 rounded-circle bg-dark border border-warning border-opacity-25">
                                    <Zap size={28} className="text-warning" />
                                </div>
                                <span className="text-gradient-gold">Affinity Echo</span>
                            </h2>
                            <p className="text-secondary lead mb-0" style={{ fontSize: '1rem' }}>
                                Temukan koneksi otentik berdasarkan interaksi dan minat bersama, bebas dari algoritma dangkal.
                            </p>
                        </div>
                    </div>

                    <Row className="g-4">
                        {affinitySuggestions.map((user) => {
                            const glowColor = getGlowColor(user.affinityScore);

                            return (
                                <Col md={6} lg={4} key={user.id}>
                                    <Card
                                        className="h-100 glass-card text-center border-0 overflow-hidden hover-lift"
                                        style={{
                                            borderRadius: VISUALIZER_CONFIG.BORDER_RADIUS,
                                        }}
                                    >

                                        {/* Affinity Visualizer */}
                                        <div
                                            className="position-relative overflow-hidden"
                                            style={{
                                                height: VISUALIZER_CONFIG.CARD_HEIGHT,
                                                background: `linear-gradient(180deg, rgba(124, 58, 237, 0.1) 0%, rgba(0,0,0,0) 100%)`
                                            }}
                                        >

                                            {/* Gema Ungu */}
                                            <div
                                                className="rounded-circle position-absolute top-50 start-50 translate-middle animate-pulse-slow"
                                                style={{
                                                    width: `${VISUALIZER_CONFIG.AVATAR_SIZE + user.mutualFollowers * 25}px`,
                                                    height: `${VISUALIZER_CONFIG.AVATAR_SIZE + user.mutualFollowers * 25}px`,
                                                    background: `radial-gradient(circle, ${glowColor} 0%, rgba(0,0,0,0) 70%)`,
                                                    zIndex: 1,
                                                    pointerEvents: 'none',
                                                }}
                                            />

                                            {/* Avatar dan Nama*/}
                                            <div
                                                className="position-absolute text-center z-3"
                                                style={{
                                                    top: '60%',
                                                    left: '50%',
                                                    transform: `translate(-50%, -50%)`,
                                                    marginTop: `${VISUALIZER_CONFIG.CONTENT_TOP_OFFSET}px`,
                                                    width: '100%',
                                                }}
                                            >
                                                <div className="position-relative d-inline-block">
                                                    <Image
                                                        src={user.avatar || "/images/default-avatar.png"}
                                                        roundedCircle
                                                        width={VISUALIZER_CONFIG.AVATAR_SIZE}
                                                        height={VISUALIZER_CONFIG.AVATAR_SIZE}
                                                        className="bg-dark mb-2 shadow-lg"
                                                        style={{ objectFit: "cover", border: `3px solid ${user.affinityScore > 0.7 ? '#7c3aed' : '#10b981'}` }}
                                                    />
                                                    <Badge
                                                        bg="dark"
                                                        className="position-absolute bottom-0 start-50 translate-middle-x border border-secondary border-opacity-50 text-white rounded-pill px-2 py-1 small shadow-sm"
                                                        style={{ marginBottom: '-10px' }}
                                                    >
                                                        {(user.affinityScore * 100).toFixed(0)}% Match
                                                    </Badge>
                                                </div>

                                                <div className="mt-3">
                                                    <Link href={`/profile/${user.username}`} className="text-decoration-none d-block">
                                                        <h5 className="fw-bold text-white mb-0 hover-underline">{user.name}</h5>
                                                    </Link>
                                                    <small className="text-secondary d-block">@{user.username}</small>
                                                </div>
                                            </div>
                                        </div>

                                        <Card.Body className="pt-4 px-4 pb-4">

                                            <div className="d-flex justify-content-center gap-2 mb-4">
                                                <div className="text-center px-3 py-2 rounded-3 bg-dark bg-opacity-50 border border-secondary border-opacity-10 w-50">
                                                    <small className="d-block text-secondary mb-1" style={{ fontSize: '0.7rem' }}>MUTUALS</small>
                                                    <span className="fw-bold text-white">
                                                        {user.mutualFollowers}
                                                    </span>
                                                </div>
                                                <div className="text-center px-3 py-2 rounded-3 bg-dark bg-opacity-50 border border-secondary border-opacity-10 w-50">
                                                    <small className="d-block text-secondary mb-1" style={{ fontSize: '0.7rem' }}>CIRCLES</small>
                                                    <span className="fw-bold text-white">
                                                        {user.mutualGroups}
                                                    </span>
                                                </div>
                                            </div>

                                            <AffinityPingForm targetUserId={user.id} />

                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}