"use client";

import PostItem from "./PostItem";

export type PostWithRelations = {
  id: number;
  content: string;
  createdAt: Date | string; 
  mediaUrl: string | null;
  mediaType: "IMAGE" | "VIDEO" | null;
  authorId: number;
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
  _count?: {
    likes: number;
    comments: number;
  };
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
      <div className="text-center text-secondary py-5 bg-dark bg-opacity-25 rounded-4 mt-3">
        <p className="mb-0 fw-bold">Belum ada postingan.</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-0">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} currentUserId={currentUserId} />
      ))}
    </div>
  );
}
