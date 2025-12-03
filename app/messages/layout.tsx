import { getConversations } from "@/app/actions";
import ChatSidebar from "@/components/Chat/ChatSidebar";
import AppHeader from "@/components/Layout/AppHeader";
import BottomNav from "@/components/Layout/BottomNav";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Col, Container, Row } from "react-bootstrap";

export default async function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("userId")?.value;

  if (!userIdCookie) {
    redirect("/login");
  }

  const userId = parseInt(userIdCookie);

  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, name: true, avatar: true },
  });

  if (!currentUser) redirect("/login");

  const conversations = await getConversations();

  return (
    <div className="bg-black min-vh-100 text-white pb-5">
      <AppHeader currentUser={currentUser} />

      {/* Tinggi dikurangi agar tidak terlalu mepet (160px untuk header + nav bottom + margin) */}
      <Container className="py-3" style={{ height: "calc(100vh - 160px)" }}>
        <Row className="h-100 justify-content-center">
          <Col md={12} lg={11} xl={9} className="h-100">
            <div className="d-flex border border-secondary border-opacity-25 rounded-4 overflow-hidden bg-dark shadow-lg h-100">
              {/* Sidebar Daftar Chat */}
              <div
                className="d-flex flex-column border-end border-secondary border-opacity-25 bg-dark"
                style={{ width: "300px", minWidth: "260px" }}
              >
                <div className="p-3 border-bottom border-secondary border-opacity-25">
                  <h5 className="fw-bold mb-0">Messages</h5>
                </div>
                <div className="flex-grow-1 overflow-auto custom-scrollbar">
                  <ChatSidebar conversations={conversations} />
                </div>
              </div>

              {/* Jendela Chat */}
              <div className="flex-grow-1 position-relative bg-black d-flex flex-column w-100">
                {children}
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <BottomNav currentUser={currentUser} />
    </div>
  );
}