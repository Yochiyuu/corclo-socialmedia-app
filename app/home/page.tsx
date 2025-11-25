import HomeView from "@/components/Home/HomeView";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("userId")?.value;

  if (!userIdCookie) {
    redirect("/login");
  }

  const currentUserId = parseInt(userIdCookie);

  const currentUser = await prisma.user.findUnique({
    where: { id: currentUserId },
    include: {
      _count: {
        select: {
          posts: true,
          followedBy: true,
          following: true,
        },
      },
    },
  });

  if (!currentUser) {
    redirect("/login");
  }

  const allPosts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: true,
      likes: { select: { userId: true } },
      comments: {
        include: { user: { select: { username: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  const suggestions = await prisma.user.findMany({
    where: {
      id: { not: currentUserId },
      followedBy: {
        none: { followerId: currentUserId },
      },
    },
    take: 3,
  });

  return (
    <HomeView
      currentUser={currentUser}
      allPosts={allPosts}
      currentUserId={currentUserId}
      suggestions={suggestions}
    />
  );
}
