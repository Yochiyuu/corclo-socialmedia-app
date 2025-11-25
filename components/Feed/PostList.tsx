"use client";

import PostItem from "./PostItem";

export type PostWithRelations = {
  id: number;
  content: string;
  createdAt: Date;
  mediaUrl: string | null;
  mediaType: "IMAGE" | "VIDEO" | null;
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

export default function PostList({
  posts,
  currentUserId,
}: {
  posts: PostWithRelations[];
  currentUserId: number;
}) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center text-secondary py-5 bg-dark rounded-4">
        <p className="mb-0">Belum ada postingan. Jadilah yang pertama!</p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostItem key={post.id} post={post} currentUserId={currentUserId} />
      ))}
    </div>
  );
}
