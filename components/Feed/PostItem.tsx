"use client";

import { addComment, deletePost, toggleLike, toggleBookmark } from "@/app/actions";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
  Share2,
  Trash2,
  Bookmark,
  X, // DIPERBAIKI: Import icon X
} from "lucide-react";
import Link from "next/link";
import React, { useState, useTransition } from "react";
import { Button, Card, Dropdown, Form, Image, InputGroup, Alert } from "react-bootstrap"; // Tambahkan Alert

const CustomToggle = React.forwardRef(({ children, onClick }: any, ref: any) => (
  <div
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    style={{ cursor: "pointer" }}
    className="text-secondary p-0"
  >
    {children}
  </div>
));
CustomToggle.displayName = "CustomToggle";

type PostProps = {
  post: {
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
      parentId?: number | null; 
    }[];
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
  const [isPending, startTransition] = useTransition();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  
  // Function handler baru:
  const handleBookmark = async () => {
    const previousState = isBookmarked;
    setIsBookmarked(!isBookmarked);

    try {
      await toggleBookmark(post.id);
    } catch (error) {
      setIsBookmarked(previousState);
    }
  };

  const topLevelComments = post.comments.filter(c => !c.parentId); 
  const repliesByParentId = post.comments.reduce((acc, comment) => {
      if (comment.parentId) { 
          if (!acc[comment.parentId]) {
              acc[comment.parentId] = [];
          }
          acc[comment.parentId].push(comment);
      }
      return acc;
  }, {} as Record<number, typeof post.comments>);

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

    // KOREKSI ERROR 1: Menghapus '/' dan memperbaiki await
    await addComment(post.id, commentText, replyingToId || undefined); 
    setCommentText("");
    setReplyingToId(null); // Reset setelah submit
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm("Yakin ingin menghapus postingan ini?");
    if (confirmDelete) {
      startTransition(async () => {
        try {
          await deletePost(post.id);
        } catch (error) {
          console.error(error);
          alert("Gagal menghapus postingan");
        }
      });
    }
  };

  const dateObj = new Date(post.createdAt);
  const timeAgo = !isNaN(dateObj.getTime())
    ? formatDistanceToNow(dateObj, { addSuffix: true, locale: idLocale })
    : "";

  return (
    <Card
      className="border-0 text-white rounded-4 shadow-sm mb-4"
      style={{ backgroundColor: "#212529" }}
    >
      <Card.Body className="p-3">
        {/* ... (Header Post) ... */}
        
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
                controls
                muted
                playsInline
              />
            )}
          </div>
        )}

        <div className="d-flex align-items-center gap-4 mt-2 border-top border-secondary border-opacity-10 pt-3">
          {/* Like Button */}
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

          {/* Comment Button */}
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

          {/* Share Button */}
          <div className="d-flex align-items-center gap-2 cursor-pointer">
            <Share2 size={20} className="text-secondary" />
          </div>

          {/* Bookmark Button */}
          <div 
            className="d-flex align-items-center gap-2 cursor-pointer ms-auto"
            onClick={handleBookmark}
            style={{ cursor: "pointer" }}
          >
            <Bookmark 
              size={20} 
              className={isBookmarked ? "text-primary fill-primary" : "text-secondary"}
              fill={isBookmarked ? "currentColor" : "none"}
            />
          </div>
        </div>

        {showComments && (
          <div className="mt-3 pt-3 border-top border-secondary border-opacity-10 animate-fade-in">
            {/* Display status Balasan */}
            {replyingToId && (
                <div className="d-flex align-items-center mb-2 p-2 rounded-pill bg-primary bg-opacity-25 text-white small justify-content-between">
                    Membalas @{post.comments.find(c => c.id === replyingToId)?.user.username}
                    <X size={14} className="cursor-pointer" onClick={() => setReplyingToId(null)} />
                </div>
            )}
            
            <div
              className="d-flex flex-column gap-3 mb-3"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              {topLevelComments.length > 0 ? (
                topLevelComments.map((comment) => (
                  <div key={comment.id} className="d-flex flex-column gap-2 border-start ps-2 border-opacity-25" style={{ borderColor: '#7c3aed' }}>
                    
                    {/* Komentar Level Atas */}
                    <div className="d-flex gap-2 align-items-center">
                        <Link
                          href={`/profile/${comment.user.username}`}
                          className="fw-bold small text-primary text-decoration-none hover-underline flex-shrink-0"
                        >
                          {comment.user.username}:
                        </Link>
                        <span className="small text-light">{comment.content}</span>
                        <small 
                           className="text-secondary ms-auto" 
                           style={{ cursor: 'pointer' }}
                           onClick={() => setReplyingToId(comment.id)} // Atur ID yang dibalas
                        >
                            Balas
                        </small>
                    </div>

                    {/* Balasan (Replies) */}
                    {repliesByParentId[comment.id]?.map(reply => (
                        <div key={reply.id} className="ms-4 d-flex gap-2 border-start ps-2 border-opacity-25" style={{ borderColor: '#a78bfa' }}>
                            <Link
                                href={`/profile/${reply.user.username}`}
                                className="fw-bold small text-info text-decoration-none hover-underline flex-shrink-0"
                            >
                                {reply.user.username}:
                            </Link>
                            <span className="small text-secondary">{reply.content}</span>
                        </div>
                    ))}
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
                  placeholder={replyingToId ? `Membalas komentar @${post.comments.find(c => c.id === replyingToId)?.user.username}...` : "Tulis komentar..."}
                  className="bg-dark border-secondary text-white"
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