import { fetchFeedLog } from "@/app/actions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AppHeader from "@/components/Layout/AppHeader";
import DataAutonomyDashboard from "@/components/Settings/DataAutonomyDashboard";
import SettingsActionItem from "@/components/Settings/SettingsActionItem";
import { Container, Row, Col, Card, Button, ListGroup, Nav } from "react-bootstrap";
import { Shield, ChevronRight, Settings, Bell, User, Lock, LogOut, Activity } from "lucide-react";
import Link from "next/link";

async function getSettingsData(currentUserId: number) {
    const feedLogs = await fetchFeedLog();
    const totalViews = feedLogs.length;

    const interactionLogs = await (prisma as any).userEngagementLog.count({
        where: {
            actorId: currentUserId,
            type: { in: ['LIKE', 'COMMENT'] }
        }
    });

    const uniquePostsViewed = new Set(feedLogs.map(log => log.targetPost?.id).filter(id => id !== undefined)).size;
    const attentionRatio = uniquePostsViewed > 0 ? (interactionLogs / uniquePostsViewed) * 100 : 0;

    return { feedLogs, totalViews, attentionRatio, interactionLogs };
}

export default async function SettingsPage({ searchParams }: { searchParams: { view?: string } }) {
    const cookieStore = await cookies();
    const userIdCookie = cookieStore.get("userId")?.value;

    if (!userIdCookie) redirect("/login");

    const currentUserId = parseInt(userIdCookie);
    const currentUser = await prisma.user.findUnique({
        where: { id: currentUserId },
        select: { username: true, avatar: true, name: true },
    });

    if (!currentUser) redirect("/login");

    const resolvedSearchParams = await (searchParams as any);
    const viewParam = resolvedSearchParams.view || 'general';

    let dashboardData = null;

    if (viewParam === 'dashboard') {
        dashboardData = await getSettingsData(currentUserId);
    }

    const SidebarItem = ({ href, icon: Icon, label, active }: { href: string, icon: any, label: string, active: boolean }) => (
        <Link href={href} className={`d-flex align-items-center gap-3 p-3 rounded-3 text-decoration-none mb-2 transition-all ${active ? 'bg-primary bg-opacity-25 text-white border border-primary border-opacity-25' : 'text-secondary hover-bg-opacity hover-text-white'}`}>
            <Icon size={20} className={active ? 'text-primary' : ''} />
            <span className="fw-medium">{label}</span>
            {active && <ChevronRight size={16} className="ms-auto text-primary" />}
        </Link>
    );

    return (
        <div className="min-vh-100 text-white" style={{ background: '#050505' }}>
            <AppHeader currentUser={currentUser} />

            {/* Background Glow */}
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '0',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, rgba(0,0,0,0) 70%)',
                borderRadius: '50%',
                filter: 'blur(80px)',
                zIndex: 0,
                pointerEvents: 'none',
                transform: 'translate(-50%, -50%)'
            }} />

            <Container className="py-5 position-relative" style={{ zIndex: 1 }}>
                <div className="mb-4">
                    <Link href="/home" className="text-secondary small d-inline-flex align-items-center text-decoration-none hover-text-primary mb-3">
                        <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} /> Kembali ke Home
                    </Link>
                    <h2 className="fw-bold d-flex align-items-center gap-3">
                        <Settings size={32} className="text-primary" />
                        <span className="text-gradient-primary">Pengaturan Akun</span>
                    </h2>
                </div>

                <Row className="g-4">
                    {/* SIDEBAR NAVIGATION */}
                    <Col lg={3} md={4}>
                        <div className="glass-card p-3 rounded-4 sticky-top" style={{ top: '100px' }}>
                            <div className="d-flex flex-column">
                                <SidebarItem href="/settings?view=general" icon={User} label="Umum" active={viewParam === 'general'} />
                                <SidebarItem href="/settings?view=privacy" icon={Lock} label="Privasi & Keamanan" active={viewParam === 'privacy'} />
                                <SidebarItem href="/settings?view=notifications" icon={Bell} label="Notifikasi" active={viewParam === 'notifications'} />
                                <SidebarItem href="/settings?view=dashboard" icon={Activity} label="Dasbor Otonomi" active={viewParam === 'dashboard'} />

                                <hr className="border-secondary border-opacity-25 my-3" />

                                <Link href="#" className="d-flex align-items-center gap-3 p-3 rounded-3 text-decoration-none text-danger hover-bg-opacity">
                                    <LogOut size={20} />
                                    <span className="fw-medium">Log Out</span>
                                </Link>
                            </div>
                        </div>
                    </Col>

                    {/* CONTENT AREA */}
                    <Col lg={9} md={8}>
                        <div className="glass-card p-4 rounded-4 min-vh-50">
                            {viewParam === 'dashboard' ? (
                                // DASHBOARD
                                <div>
                                    <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-secondary border-opacity-25">
                                        <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
                                            <Activity size={24} className="text-success" /> Dasbor Otonomi Data
                                        </h4>
                                        <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill">Live Data</span>
                                    </div>
                                    {dashboardData && <DataAutonomyDashboard {...dashboardData} />}
                                </div>
                            ) : viewParam === 'privacy' ? (
                                // PRIVASI & KEAMANAN
                                <div>
                                    <h4 className="fw-bold mb-4 pb-3 border-bottom border-secondary border-opacity-25 d-flex align-items-center gap-2">
                                        <Lock size={24} className="text-warning" /> Privasi & Keamanan
                                    </h4>
                                    <ListGroup variant="flush" className="bg-transparent">
                                        <SettingsActionItem href="#" text="Mode Akun Privat" isSwitch={true} />
                                        <SettingsActionItem href="#" text="Tampilkan Status Aktif" isSwitch={true} />
                                        <SettingsActionItem href="#" text="Izinkan Pesan dari Siapa Saja" isSwitch={true} />
                                        <SettingsActionItem href="#" text="Kelola Daftar Blokir" />
                                        <SettingsActionItem href="#" text="History Log In" />
                                    </ListGroup>
                                </div>
                            ) : viewParam === 'notifications' ? (
                                // NOTIFIKASI
                                <div>
                                    <h4 className="fw-bold mb-4 pb-3 border-bottom border-secondary border-opacity-25 d-flex align-items-center gap-2">
                                        <Bell size={24} className="text-info" /> Pengaturan Notifikasi
                                    </h4>
                                    <ListGroup variant="flush" className="bg-transparent">
                                        <SettingsActionItem href="#" text="Notifikasi Postingan Baru" isSwitch={true} />
                                        <SettingsActionItem href="#" text="Notifikasi Komentar & Likes" isSwitch={true} />
                                        <SettingsActionItem href="#" text="Notifikasi Pesan Langsung" isSwitch={true} />
                                        <SettingsActionItem href="#" text="Notifikasi Email" isSwitch={true} />
                                    </ListGroup>
                                </div>
                            ) : (
                                // GENERAL (DEFAULT)
                                <div>
                                    <h4 className="fw-bold mb-4 pb-3 border-bottom border-secondary border-opacity-25 d-flex align-items-center gap-2">
                                        <User size={24} className="text-primary" /> Pengaturan Umum
                                    </h4>

                                    <div className="mb-4 text-center p-4 rounded-4 bg-dark bg-opacity-50 border border-secondary border-opacity-10">
                                        <div className="d-inline-block position-relative mb-3">
                                            <img
                                                src={currentUser.avatar || '/images/default-avatar.png'}
                                                alt="Profile"
                                                className="rounded-circle border border-2 border-primary shadow-lg"
                                                width={100}
                                                height={100}
                                                style={{ objectFit: 'cover' }}
                                            />
                                            <Button size="sm" variant="primary" className="position-absolute bottom-0 end-0 rounded-circle p-2 border border-dark">
                                                <Settings size={14} />
                                            </Button>
                                        </div>
                                        <h5 className="fw-bold mb-1">{currentUser.name}</h5>
                                        <p className="text-secondary small">@{currentUser.username}</p>
                                        <Button href="/profile/edit" variant="outline-light" size="sm" className="rounded-pill px-4 mt-2">Edit Profil</Button>
                                    </div>

                                    <ListGroup variant="flush" className="bg-transparent">
                                        <SettingsActionItem href="/profile/edit" text="Edit Informasi Profil" variant="secondary" />
                                        <SettingsActionItem href="#" text="Ubah Kata Sandi" variant="secondary" />
                                        <SettingsActionItem href="#" text="Bahasa & Wilayah" variant="secondary" />
                                        <div className="mt-4 pt-3 border-top border-secondary border-opacity-25">
                                            <SettingsActionItem href="#" text="Hapus Akun Permanen" isDanger={true} />
                                        </div>
                                    </ListGroup>
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}