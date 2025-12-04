import AppHeader from "@/components/Layout/AppHeader";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Col, Container, Row } from "react-bootstrap";
import { ArrowLeft } from "lucide-react";
import FollowersList from "@/components/Profile/FollowersList";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function FollowersPage({ params }: Props) {
  const { username } = await params;
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("userId")?.value;

  if (!userIdCookie) redirect("/login");
  const currentUserId = parseInt(userIdCookie);

  const currentUser = await prisma.user.findUnique({
    where: { id: currentUserId },
    select: { username: true, avatar: true, name: true },
  });

  if (!currentUser) redirect("/login");

  const profileUser = await prisma.user.findUnique({
    where: { username: username },
    select: { id: true, name: true, username: true },
  });

  if (!profileUser) return notFound();

  const followersList = await prisma.follows.findMany({
    where: { followingId: profileUser.id }, 
    include: {
      follower: { 
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
          bio: true,
          followedBy: {
            where: { followerId: currentUserId },
          },
        },
      },
    },
  });

  return (
    <div className="bg-black min-vh-100 text-white">
      <AppHeader currentUser={currentUser} />
      
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col lg={8} md={10}>
            <div className="d-flex align-items-center gap-3 mb-4 border-bottom border-secondary border-opacity-25 pb-3">
              <Link href={`/profile/${username}`} className="text-white hover-opacity">
                <ArrowLeft size={24} />
              </Link>
              <div>
                <h5 className="fw-bold mb-0 text-white">{profileUser.name}</h5>
                <small className="text-secondary">@{profileUser.username}</small>
              </div>
            </div>

            <h4 className="fw-bold mb-4">Followers</h4>

            {followersList.length === 0 ? (
              <div className="text-center py-5 text-secondary">
                <p>Belum memiliki pengikut.</p>
              </div>
            ) : (
              <FollowersList followersList={followersList} currentUserId={currentUserId} />
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}