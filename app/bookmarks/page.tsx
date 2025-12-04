import AppHeader from "@/components/Layout/AppHeader";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Bookmark, Ghost } from "lucide-react";
import PostList, { PostWithRelations } from "@/components/Feed/PostList";

type BookmarkWithPost = {
  post: PostWithRelations & {
    author: {
      name: string;
      username: string;
      avatar: string | null;
    };
    likes: { userId: number }[];
    comments: {
      id: number;
      content: string;
      user: { username: string };
    }[];
  };
};

type BookmarkedPost = PostWithRelations;

export default async function BookmarksPage() {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("userId")?.value;

  if (!userIdCookie) redirect("/login");
  const currentUserId = parseInt(userIdCookie);

  const currentUser = await prisma.user.findUnique({
    where: { id: currentUserId },
    select: { username: true, avatar: true, name: true },
  });

  if (!currentUser) redirect("/login");

  // Fetch bookmarks
  const bookmarks = await (prisma.bookmark as any).findMany({
    where: { userId: currentUserId },
    orderBy: { createdAt: "desc" },
    include: {
      post: {
        include: {
          author: true,
          likes: { select: { userId: true } },
          comments: {
            include: { user: { select: { username: true } } },
            orderBy: { createdAt: "asc" as const },
          },
        },
      },
    },
  }) as BookmarkWithPost[];
  const bookmarkedPosts: BookmarkedPost[] = bookmarks.map((b: BookmarkWithPost) => ({
    ...b.post,
    bookmarks: [{ userId: currentUserId }],
    author: b.post.author,
    likes: b.post.likes,
    comments: b.post.comments,
  }));

  return (
    <div className="min-vh-100 text-white" style={{ background: '#050505' }}>
      <AppHeader currentUser={currentUser} />

      {/* Decorative Background Elements */}
      <div style={{
        position: 'fixed',
        top: '20%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <Container className="py-5 position-relative" style={{ zIndex: 1 }}>
        <Row className="justify-content-center">
          <Col lg={8} md={12}>
            <div className="d-flex align-items-center justify-content-between mb-5">
              <div>
                <h2 className="fw-bold mb-1 d-flex align-items-center gap-3">
                  <div className="p-2 rounded-circle" style={{ background: 'rgba(124, 58, 237, 0.1)' }}>
                    <Bookmark size={28} className="text-primary" />
                  </div>
                  <span className="text-gradient-primary">Koleksi Tersimpan</span>
                </h2>
                <p className="text-secondary mb-0 ms-1">Arsip pribadi momen favorit Anda</p>
              </div>
            </div>

            {bookmarkedPosts.length === 0 ? (
              <Card className="p-5 text-center border-0 rounded-5 glass-card hover-lift">
                <div className="mb-4 position-relative d-inline-block">
                  <div className="position-absolute top-50 start-50 translate-middle" style={{ width: '80px', height: '80px', background: 'rgba(124, 58, 237, 0.2)', borderRadius: '50%', filter: 'blur(20px)' }}></div>
                  <Ghost size={64} className="text-secondary position-relative z-1 opacity-50" />
                </div>
                <h3 className="fw-bold mb-2">Belum ada Postingan Tersimpan</h3>
                <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: '400px' }}>
                  Jelajahi feed dan simpan postingan yang menginspirasi Anda dengan mengetuk ikon bookmark.
                </p>
                <div>
                  <a href="/home" className="btn btn-premium rounded-pill px-4">
                    Jelajahi Feed
                  </a>
                </div>
              </Card>
            ) : (
              <div className="d-flex flex-column gap-4">
                {/* Optional: Filter/Search Bar Placeholder for Premium Feel */}
                <div className="glass-card p-3 rounded-4 d-flex align-items-center justify-content-between mb-2">
                  <span className="text-secondary small fw-bold text-uppercase letter-spacing-1 ps-2">
                    {bookmarkedPosts.length} Item Tersimpan
                  </span>
                  {/* Visual only filter */}
                  <div className="d-flex gap-2">
                    <span className="badge bg-dark border border-secondary border-opacity-25 text-secondary px-3 py-2 rounded-pill cursor-pointer hover-bg-opacity">Terbaru</span>
                    <span className="badge bg-dark border border-secondary border-opacity-25 text-secondary px-3 py-2 rounded-pill cursor-pointer hover-bg-opacity">Media</span>
                  </div>
                </div>

                <PostList posts={bookmarkedPosts} currentUserId={currentUserId} />
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}