import { getNotifications } from "@/app/actions";
import AppHeader from "@/components/Layout/AppHeader";
import AppSidebar from "@/components/Layout/AppSidebar";
import NotificationList from "@/components/Notifications/NotificationsList";
import { prisma } from "@/lib/prisma";
import { Bell } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Col, Container, Row } from "react-bootstrap";

export default async function NotificationsPage() {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("userId")?.value;

  if (!userIdCookie) redirect("/login");
  const currentUserId = parseInt(userIdCookie);

  const currentUser = await prisma.user.findUnique({
    where: { id: currentUserId },
    select: { username: true, avatar: true, name: true },
  });

  if (!currentUser) redirect("/login");

  const notifications = await getNotifications();

  return (
    <div className="bg-black min-vh-100 text-white">
      <AppHeader currentUser={currentUser} />
      
      <Container className="py-4">
        <Row className="g-4">
          <Col lg={3} className="d-none d-lg-block">
            <div className="sticky-top" style={{ top: "90px" }}>
              <AppSidebar currentUser={currentUser} activePage="notifications" />
            </div>
          </Col>

          <Col lg={9} md={12}>
            <div className="mb-4 pb-3 border-bottom border-secondary border-opacity-25">
              <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <Bell size={24} className="text-primary" /> Notifikasi
              </h4>
            </div>

            <NotificationList notifications={notifications as any} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}