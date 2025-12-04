import { fetchFeedLog } from "@/app/actions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AppHeader from "@/components/Layout/AppHeader";
import DataAutonomyDashboard from "@/components/Settings/DataAutonomyDashboard";
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import { Shield, ChevronRight, Settings } from "lucide-react";
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

  return (
    <>
      <AppHeader currentUser={currentUser} />
      <Container className="py-4">
        <Row className="g-4 justify-content-center">
            <Col lg={8} md={12}>
                {viewParam === 'dashboard' ? (
                    // --- TAMPILAN DASHBOARD ---
                    <div className="mb-4">
                        <Link href="/settings" className="text-secondary small mb-3 d-inline-flex align-items-center text-decoration-none hover-text-primary">
                            <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} /> Kembali ke Pengaturan
                        </Link>
                        {dashboardData && <DataAutonomyDashboard {...dashboardData} />}
                    </div>
                ) : (
                    // --- TAMPILAN SETTINGS HUB (DEFAULT) ---
                    <>
                        <h2 className="fw-bold mb-4 d-flex align-items-center gap-2">
                            <Settings size={32} className="text-primary" /> Pengaturan Akun
                        </h2>
                        
                        <Card className="mb-3 bg-dark border-secondary border-opacity-25">
                            <ListGroup variant="flush">
                                <Link href="#" className="list-group-item bg-transparent text-white d-flex justify-content-between align-items-center py-3 hover-bg-opacity border-secondary border-opacity-10">
                                    <span className="fw-bold">Privasi & Keamanan</span>
                                    <ChevronRight size={18} className="text-secondary" />
                                </Link>
                                <Link href="#" className="list-group-item bg-transparent text-white d-flex justify-content-between align-items-center py-3 hover-bg-opacity border-secondary border-opacity-10">
                                    <span className="fw-bold">Notifikasi</span>
                                    <ChevronRight size={18} className="text-secondary" />
                                </Link>
                                <Link href="/settings?view=dashboard" className="list-group-item bg-transparent text-white d-flex justify-content-between align-items-center py-3 hover-bg-opacity border-secondary border-opacity-10">
                                    <span className="fw-bold d-flex align-items-center gap-2">
                                        <Shield size={20} className="text-success"/> Dasbor Otonomi Data
                                    </span>
                                    <Button variant="primary" size="sm" className="rounded-pill fw-bold">Lihat</Button>
                                </Link>
                            </ListGroup>
                        </Card>

                        <Card className="mb-3 bg-dark border-secondary border-opacity-25">
                             <ListGroup variant="flush">
                                <Link href="/profile/edit" className="list-group-item bg-transparent text-white d-flex justify-content-between align-items-center py-3 hover-bg-opacity border-secondary border-opacity-10">
                                    <span className="fw-bold">Edit Profil</span>
                                    <ChevronRight size={18} className="text-secondary" />
                                </Link>
                                <Link href="#" className="list-group-item bg-transparent text-danger d-flex justify-content-between align-items-center py-3 hover-bg-opacity border-secondary border-opacity-10">
                                    <span className="fw-bold">Hapus Akun</span>
                                    <ChevronRight size={18} className="text-secondary" />
                                </Link>
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