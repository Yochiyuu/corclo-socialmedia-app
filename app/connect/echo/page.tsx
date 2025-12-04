import { useFormState } from "react-dom";
import { sendAffinityPing } from "@/app/actions";
import AppHeader from "@/components/Layout/AppHeader";
import AppSidebar from "@/components/Layout/AppSidebar";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Container, Row, Col, Card, Button, Image, Badge, Alert } from "react-bootstrap"; // Import Alert
import { Zap, MessageCircle } from "lucide-react";
import Link from "next/link";

// --- TIPE AFFINITY FORM STATE ---
// Tipe kembalian dari sendAffinityPing
type AffinityFormState = {
    success: boolean;
    message: string;
} | undefined | null; 

// --- KOMPONEN CLIENT-SIDE UNTUK MENGIRIM PING (BARU) ---
function AffinityPingForm({ targetUserId }: { targetUserId: number }) {
    // 1. Deklarasi useFormState dengan tipe AffinityFormState dan casting
    const [state, formAction] = useFormState<AffinityFormState, FormData>(
        sendAffinityPing as (prevState: AffinityFormState, formData: FormData) => Promise<AffinityFormState>,
        null
    );
    
    return (
        // 2. Gunakan formAction sebagai action
        <form action={formAction}>
            <input type="hidden" name="targetUserId" value={targetUserId} />
            
            {/* Tampilkan notifikasi keberhasilan/kegagalan */}
            {state && (
                <Alert 
                    variant={state.success ? "success" : "danger"} 
                    className="py-2 small mb-2"
                >
                    {state.message}
                </Alert>
            )}

            <Button
                variant="primary"
                type="submit"
                className="w-100 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2"
                style={{ backgroundColor: "#7c3aed", border: "none" }}
            >
                <MessageCircle size={18} /> Send Affinity Ping
            </Button>
        </form>
    );
}
// --- END AffinityPingForm ---


// Asumsi: kita ambil 6 user yang belum di-follow dan memiliki mutuals
async function fetchAffinitySuggestions(currentUserId: number) {
    const suggestions = await prisma.user.findMany({
        where: {
            id: { not: currentUserId },
            followedBy: { none: { followerId: currentUserId } },
            // Filter user yang memiliki minimal 1 mutual (ini query yang lebih kompleks di Prisma)
        },
        take: 6,
        select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            _count: {
                select: {
                    followedBy: true,
                    following: true
                }
            }
            // Di sini nanti akan di-include GroupMembership dan Mutuals
        }
    });

    // Dummy logic untuk skor afinitas (Nantinya diganti dengan logika calculateAffinityScore)
    const suggestionsWithScore = suggestions.map((user, index) => ({
        ...user,
        affinityScore: 0.75 + (index % 2 === 0 ? 0.05 : -0.05), // Contoh skor 0.70 atau 0.80
        mutualGroups: 2 + (index % 3),
        mutualFollowers: 1 + (index % 2)
    }));
    
    return suggestionsWithScore;
}


export default async function AffinityEchoPage() {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("userId")?.value;
  
  if (!userIdCookie) redirect("/login");

  const currentUserId = parseInt(userIdCookie);
  const currentUser = await prisma.user.findUnique({
    where: { id: currentUserId },
    select: { username: true, avatar: true, name: true },
  });

  if (!currentUser) redirect("/login");

  const affinitySuggestions = await fetchAffinitySuggestions(currentUserId);

  return (
    <>
      <AppHeader currentUser={currentUser} />
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
                                
                                {/* PANGGIL KOMPONEN CLIENT BARU DI SINI */}
                                <AffinityPingForm targetUserId={user.id} />

                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}