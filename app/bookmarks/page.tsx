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
  const bookmarkedPosts: PostWithRelations[] = bookmarks.map((b: BookmarkWithPost) => ({
    ...b.post,
    author: b.post.author,
    likes: b.post.likes,
    comments: b.post.comments,
  }));
  
  return (
    <div className="bg-black min-vh-100 text-white">
      <AppHeader currentUser={currentUser} />
      <Container className="py-4">
        <Row className="g-4 justify-content-center">
          <Col lg={7} md={12}>
            <h2 className="fw-bold mb-4 d-flex align-items-center gap-2 border-bottom border-secondary border-opacity-25 pb-3">
              <Bookmark size={32} className="text-primary" /> Postingan Tersimpan
            </h2>
            
            {bookmarkedPosts.length === 0 ? (
                <Card className="p-5 text-center bg-dark border-0 rounded-4 shadow-sm">
                    <Ghost size={48} className="text-secondary mb-3 mx-auto" />
                    <h4 className="fw-bold">Belum ada Postingan Tersimpan</h4>
                    <p className="text-secondary mb-0">
                        Anda dapat menyimpan postingan dengan mengklik ikon bookmark.
                    </p>
                </Card>
            ) : (
                <PostList posts={bookmarkedPosts} currentUserId={currentUserId} />
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}