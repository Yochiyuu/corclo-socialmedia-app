import ExploreView from "@/components/Explore/ExploreView";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ExplorePage() {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("userId")?.value;

  if (!userIdCookie) {
    redirect("/login");
  }

  const currentUserId = parseInt(userIdCookie);

  const currentUser = await prisma.user.findUnique({
    where: { id: currentUserId },
    select: {
      id: true,
      username: true,
      name: true,
      avatar: true,
    },
  });

  if (!currentUser) {
    redirect("/login");
  }

  const explorePosts = await prisma.post.findMany({
    where: {
      mediaUrl: { not: null }, 
    },
    take: 30,
    orderBy: {
      likes: {
        _count: "desc", 
      },
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
      likes: {
        where: { userId: currentUserId },
        select: { userId: true },
      },
    },
  });

  return (
    <ExploreView
      currentUser={currentUser}
      initialPosts={explorePosts}
      currentUserId={currentUserId}
    />
  );
}