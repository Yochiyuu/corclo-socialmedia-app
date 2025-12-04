import StoryBar from "@/components/Feed/StoryBar";
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

  const now = new Date();

  const following = await prisma.follows.findMany({
    where: { followerId: currentUserId },
    select: { followingId: true },
  });
  const followingIds = following.map((f) => f.followingId);

  const visibleUserIds = [...followingIds, currentUserId];
  const usersWithStories = await prisma.user.findMany({
    where: {
      id: { in: visibleUserIds },
      stories: {
        some: {
          expiresAt: { gt: now },
        },
      },
    },
    select: {
      id: true,
      username: true,
      avatar: true,
    },
    distinct: ["id"],
  });

  const friendStories = usersWithStories.filter((u) => u.id !== currentUserId);

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

  const allPostsSerialized = allPosts.map((post) => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
    comments: post.comments.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
    })),
  })) as any;

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
      allPosts={allPostsSerialized}
      currentUserId={currentUserId}
      suggestions={suggestions}
      storySection={
        <StoryBar
          currentUser={{ avatar: currentUser.avatar }}
          usersWithStories={friendStories}
        />
      }
    />
  );
}
