import { fetchFeedLog } from "@/app/actions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AppHeader from "@/components/Layout/AppHeader";
import DataAutonomyDashboard from "@/components/Settings/DataAutonomyDashboard";
import SettingsActionItem from "@/components/Settings/SettingsActionItem";
import { Container, Row, Col, Card, Button, ListGroup, Form } from "react-bootstrap";
import { Shield, ChevronRight, Settings, Bell} from "lucide-react";
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
  const viewParam = resolvedSearchParams.view;
  
  let dashboardData = null;

  if (viewParam === 'dashboard') {
    dashboardData = await getSettingsData(currentUserId);
  }

  const BackLink = ({ target }: { target: string }) => (
    <Link href={target} className="text-secondary small d-inline-flex align-items-center text-decoration-none hover-text-primary mb-4">
        <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} /> Kembali ke {target === '/home' ? 'Home' : 'Pengaturan'}
    </Link>
  );

  return (
    <>
      <AppHeader currentUser={currentUser} />
      <Container className="py-4">
        <Row className="g-4 justify-content-center">
            <Col lg={8} md={12}>
                {/* --- BACK TO HOME LINK --- */}
                {viewParam ? (
                    <BackLink target="/settings" />
                ) : (
                    <div className="mb-4">
                        <BackLink target="/home" />
                    </div>
                )}

                {/* --- Dynamic Content Rendering --- */}
                {viewParam === 'dashboard' ? (
                    // DASHBOARD
                    <div className="mb-4">
                        {dashboardData && <DataAutonomyDashboard {...dashboardData} />}
                    </div>
                ) : viewParam === 'privacy' ? (
                    // PRIVASI & KEAMANAN
                    <div className="mb-4">
                        <h2 className="fw-bold mb-4 d-flex align-items-center gap-2"><Shield size={32} className="text-success" /> Privasi & Keamanan</h2>
                        <Card className="bg-dark border-secondary border-opacity-25">
                            <ListGroup variant="flush">
                                <SettingsActionItem href="#" text="Mode Akun Privat" isSwitch={true} />
                                <SettingsActionItem href="#" text="Tampilkan Status Aktif" isSwitch={true} />
                                <SettingsActionItem href="#" text="Izinkan Pesan dari Siapa Saja" isSwitch={true} />
                                <SettingsActionItem href="#" text="Kelola Daftar Blokir" />
                                <SettingsActionItem href="#" text="History Log In" />
                            </ListGroup>
                        </Card>
                    </div>
                ) : viewParam === 'notifications' ? (
                    // NOTIFIKASI
                    <div className="mb-4">
                        <h2 className="fw-bold mb-4 d-flex align-items-center gap-2"><Bell size={32} className="text-info" /> Pengaturan Notifikasi</h2>
                        <Card className="bg-dark border-secondary border-opacity-25">
                            <ListGroup variant="flush">
                                <SettingsActionItem href="#" text="Notifikasi Postingan Baru" isSwitch={true} />
                                <SettingsActionItem href="#" text="Notifikasi Komentar & Likes" isSwitch={true} />
                                <SettingsActionItem href="#" text="Notifikasi Pesan Langsung" isSwitch={true} />
                                <SettingsActionItem href="#" text="Notifikasi Email" isSwitch={true} />
                            </ListGroup>
                        </Card>
                    </div>
                ) : (
                    // SETTINGS HUB (DEFAULT) - TAMPILAN UTAMA
                    <>
                        <h2 className="fw-bold mb-4 d-flex align-items-center gap-2">
                            <Settings size={32} className="text-primary" /> Pengaturan Akun
                        </h2>
                        
                        <Card 
                            className="mb-4 rounded-4 shadow-lg"
                            style={{ 
                                background: "rgba(33, 37, 41, 0.9)",
                                border: '1px solid rgba(124, 58, 237, 0.5)',
                            }}
                        >
                            <ListGroup variant="flush">
                                {/* Navigasi Kategori */}
                                <SettingsActionItem href="/settings?view=privacy" text="Privasi & Keamanan" variant="secondary" />
                                <SettingsActionItem href="/settings?view=notifications" text="Notifikasi" variant="secondary" />
                                
                                {/* Dasbor Otonomi */}
                                <Link href="/settings?view=dashboard" className="list-group-item bg-transparent text-white d-flex justify-content-between align-items-center py-3 hover-bg-opacity border-secondary border-opacity-10">
                                    <span className="fw-bold d-flex align-items-center gap-2">
                                        <Shield size={20} className="text-success"/> Dasbor Otonomi Data
                                    </span>
                                    <Button variant="outline-success" size="sm" className="rounded-pill fw-bold">Lihat</Button>
                                </Link>
                            </ListGroup>
                        </Card>

                        <Card className="mb-3 bg-dark border-secondary border-opacity-25 rounded-4 shadow-lg">
                             <ListGroup variant="flush">
                                {/* Aksi Akun */}
                                <SettingsActionItem href="/profile/edit" text="Edit Profil" variant="secondary" />
                                <SettingsActionItem href="#" text="Hapus Akun" isDanger={true} />
                                <SettingsActionItem href="#" text="Log Out" isDanger={true} isLogout={true} /> 
                            </ListGroup>
                        </Card>
                    </>
                )}
            </Col>
        </Row>
      </Container>
    </>
  );
}