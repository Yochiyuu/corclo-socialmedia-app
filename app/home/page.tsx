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

  // 1. Current User
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

  // 2. Fetch Users with Active Stories
  const now = new Date();

  // Ambil list ID following
  const following = await prisma.follows.findMany({
    where: { followerId: currentUserId },
    select: { followingId: true },
  });
  const followingIds = following.map((f) => f.followingId);

  // Masukkan user sendiri ke list untuk cek (meski story sendiri tidak masuk list teman, logikanya bisa dikembangkan)
  const visibleUserIds = [...followingIds, currentUserId];

  // Query user yang punya story aktif
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

  // Pisahkan story teman (exclude user sendiri karena ada tombol upload khusus)
  const friendStories = usersWithStories.filter((u) => u.id !== currentUserId);

  // 3. Fetch Posts
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

  // 4. Fetch Suggestions
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
      // Pass component StoryBar sebagai props
      storySection={
        <StoryBar
          currentUser={{ avatar: currentUser.avatar }}
          usersWithStories={friendStories}
        />
      }
    />
  );
}
