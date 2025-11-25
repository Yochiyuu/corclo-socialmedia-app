import ProfileView from "@/components/Profile/ProfileView";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params;

  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("userId")?.value;
  const currentUserId = userIdCookie ? parseInt(userIdCookie) : 0;

  const user = await prisma.user.findUnique({
    where: { username: username },
    include: {
      _count: {
        select: {
          posts: true,
          followedBy: true,
          following: true,
        },
      },
      followedBy: {
        where: { followerId: currentUserId },
        select: { followerId: true },
      },
      posts: {
        orderBy: { createdAt: "desc" },
        include: {
          likes: { select: { userId: true } },
          comments: {
            include: { user: { select: { username: true } } },
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });

  if (!user) {
    return notFound();
  }

  const isOwnProfile = currentUserId === user.id;
  const isFollowing = user.followedBy.length > 0;

  return (
    <ProfileView
      user={user}
      isOwnProfile={isOwnProfile}
      currentUserId={currentUserId}
      isFollowing={isFollowing}
    />
  );
}
