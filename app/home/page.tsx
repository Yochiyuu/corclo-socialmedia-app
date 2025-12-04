import StoryBar from "@/components/Feed/StoryBar";
import HomeView from "@/components/Home/HomeView";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logEngagement } from "../actions";

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

  const suggestions = await prisma.user.findMany({
    where: {
      id: { not: currentUserId },
      followedBy: {
        none: { followerId: currentUserId },
      },
    },
    take: 3,
  });

  const postsToLog = allPosts.slice(0, 50); // Batasi log untuk 50 post pertama
  const viewPromises = postsToLog.map(post => 
    logEngagement("VIEW" as any, post.id)
  );
  await Promise.all(viewPromises);

  return (
    <HomeView
      currentUser={currentUser}
      allPosts={allPosts}
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
