"use client";

import { addComment, toggleLike } from "@/app/actions";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button, Card, Form, Image, InputGroup } from "react-bootstrap";

type PostProps = {
  post: {
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
    comments: { id: number; content: string; user: { username: string } }[];
  };
  currentUserId: number;
};

export default function PostItem({ post, currentUserId }: PostProps) {
  const [isLiked, setIsLiked] = useState(
    post.likes.some((like) => like.userId === currentUserId)
  );
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleLike = async () => {
    const previousState = isLiked;
    const previousCount = likeCount;

    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    try {
      await toggleLike(post.id);
    } catch (error) {
      setIsLiked(previousState);
      setLikeCount(previousCount);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    await addComment(post.id, commentText);
    setCommentText("");
  };

  return (
    <Card
      className="border-0 text-white rounded-4 shadow-sm mb-4"
      style={{ backgroundColor: "#212529" }}
    >
      <Card.Body className="p-3">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-3">
            <Link href={`/profile/${post.author.username}`}>
              <Image
                src={post.author.avatar || "/images/default-avatar.png"}
                roundedCircle
                width={40}
                height={40}
                alt="avatar"
                style={{ objectFit: "cover", cursor: "pointer" }}
              />
            </Link>

            <div style={{ lineHeight: "1.2" }}>
              <Link
                href={`/profile/${post.author.username}`}
                className="text-decoration-none"
              >
                <h6 className="fw-bold mb-0 text-white hover-underline">
                  {post.author.name}
                </h6>
              </Link>

              <small className="text-secondary" style={{ fontSize: "12px" }}>
                {new Date(post.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                WIB •
                <Link
                  href={`/profile/${post.author.username}`}
                  className="text-decoration-none text-secondary ms-1 hover-underline"
                >
                  @{post.author.username}
                </Link>
              </small>
            </div>
          </div>

          <Button variant="link" className="text-secondary p-0">
            <MoreHorizontal size={20} />
          </Button>
        </div>

        {post.content && (
          <p
            className="fs-6 mb-3 fw-normal text-light"
            style={{ whiteSpace: "pre-line" }}
          >
            {post.content}
          </p>
        )}

        {post.mediaUrl && (
          <div className="mb-3 rounded-4 overflow-hidden w-100 bg-black">
            {post.mediaType === "IMAGE" ? (
              <img
                src={post.mediaUrl}
                alt="media"
                className="w-100"
                style={{ maxHeight: "500px", objectFit: "contain" }}
              />
            ) : (
              <video
                src={post.mediaUrl}
                className="w-100"
                style={{ maxHeight: "500px" }}
                autoPlay
                loop
                muted
                playsInline
                controls
              />
            )}
          </div>
        )}

        <div className="d-flex align-items-center gap-4 mt-2 border-top border-secondary border-opacity-10 pt-3">
          <div
            className="d-flex align-items-center gap-2 cursor-pointer"
            onClick={handleLike}
            style={{ cursor: "pointer" }}
          >
            <Heart
              size={20}
              className={isLiked ? "text-danger fill-danger" : "text-secondary"}
              fill={isLiked ? "currentColor" : "none"}
            />
            <span
              className={`small fw-bold ${
                isLiked ? "text-danger" : "text-secondary"
              }`}
            >
              {likeCount}
            </span>
          </div>

          <div
            className="d-flex align-items-center gap-2 cursor-pointer"
            onClick={() => setShowComments(!showComments)}
            style={{ cursor: "pointer" }}
          >
            <MessageCircle size={20} className="text-secondary" />
            <span className="text-secondary small fw-bold">
              {post.comments.length}
            </span>
          </div>

          <div className="d-flex align-items-center gap-2 cursor-pointer ms-auto">
            <Share2 size={20} className="text-secondary" />
          </div>
        </div>

        {showComments && (
          <div className="mt-3 pt-3 border-top border-secondary border-opacity-10 animate-fade-in">
            <div
              className="d-flex flex-column gap-2 mb-3"
              style={{ maxHeight: "200px", overflowY: "auto" }}
            >
              {post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <div key={comment.id} className="d-flex gap-2">
                    <Link
                      href={`/profile/${comment.user.username}`}
                      className="fw-bold small text-primary text-decoration-none hover-underline"
                    >
                      {comment.user.username}:
                    </Link>
                    <span className="small text-light">{comment.content}</span>
                  </div>
                ))
              ) : (
                <small className="text-secondary fst-italic">
                  Belum ada komentar.
                </small>
              )}
            </div>

            <form onSubmit={handleCommentSubmit}>
              <InputGroup>
                <Form.Control
                  placeholder="Tulis komentar..."
                  className="bg-dark border-secondary text-white text-sm"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  style={{ fontSize: "0.9rem" }}
                />
                <Button
                  variant="primary"
                  type="submit"
                  style={{ backgroundColor: "#7c3aed", border: "none" }}
                >
                  <Send size={16} />
                </Button>
              </InputGroup>
            </form>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
