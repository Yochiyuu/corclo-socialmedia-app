"use client";

import { logout, toggleLike, addComment, getPostDetails } from "@/app/actions";
import {
  Bell,
  Bookmark,
  Hash,
  Heart,
  Home,
  LogOut,
  MessageCircle,
  Play,
  Search,
  Settings,
  User,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition, useRef, useCallback } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Nav,
  Navbar,
  Row,
} from "react-bootstrap";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

type PostAuthor = {
  id: number;
  username: string;
  avatar: string | null;
};

type CommentType = {
  id: number;
  content: string;
  createdAt: Date;
  userId: number;
  postId: number;
  user: {
    id: number;
    username: string;
    avatar: string | null;
  };
};

type PostType = {
  id: number;
  content: string | null;
  mediaUrl: string | null;
  mediaType: string | null;
  author: PostAuthor;
  _count: {
    likes: number;
    comments: number;
  };
  likes: { userId: number }[];
};

type PostDetailType = PostType & {
  comments: CommentType[];
};

type ExploreViewProps = {
  currentUser: {
    id: number;
    username: string;
    name: string;
    avatar: string | null;
  };
  initialPosts: PostType[];
  currentUserId: number;
};

export default function ExploreView({
  currentUser,
  initialPosts,
  currentUserId,
}: ExploreViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const [postDetails, setPostDetails] = useState<PostDetailType | null>(null);
  const [posts, setPosts] = useState(initialPosts);
  const [isPending, startTransition] = useTransition();
  const commentFormRef = useRef<HTMLFormElement>(null);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false); 

  const fetchPostDetails = useCallback(async (postId: number) => {
    setIsFetchingDetails(true);
    const details = await getPostDetails(postId);
    if (details) {
      setPostDetails(details as PostDetailType);
      setSelectedPost(details as PostType);
    }
    setIsFetchingDetails(false);
  }, []);

  const handleOpenModal = (post: PostType) => {
    setSelectedPost(post);
    setShowAllComments(false);
    fetchPostDetails(post.id);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
    setPostDetails(null);
    setShowAllComments(false);
  };
  
  const handleToggleComments = () => {
    if ((postDetails as PostDetailType)?.comments?.length > 0) {
      setShowAllComments((prev) => !prev);
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (searchQuery) {
      return (
        post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
    });

  const handleToggleLike = (postId: number) => {
    if (isPending) return;
    
    startTransition(() => {
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            const isLiked = post.likes.some(
              (l) => l.userId === currentUserId
            );
            const newLikes = isLiked
              ? post.likes.filter((l) => l.userId !== currentUserId)
              : [...post.likes, { userId: currentUserId }];

            if (selectedPost && selectedPost.id === postId) {
              setSelectedPost({
                ...selectedPost,
                likes: newLikes,
                _count: {
                  ...selectedPost._count,
                  likes: newLikes.length,
                },
              });
            }

            return {
              ...post,
              likes: newLikes,
              _count: {
                ...post._count,
                likes: newLikes.length,
              },
            };
          }
          return post;
        })
      );
      toggleLike(postId);
    });
  };

  const handleAddComment = async (formData: FormData) => {
    if (!selectedPost) return;

    const content = formData.get("commentContent") as string;
    if (!content.trim()) return;

    setPostDetails((prevDetails) => {
      if (!prevDetails) return null;
      const newComment: CommentType = {
        id: Date.now(),
        content: content,
        createdAt: new Date(),
        userId: currentUserId,
        postId: selectedPost.id,
        user: {
          id: currentUser.id,
          username: currentUser.username,
          avatar: currentUser.avatar,
        },
      };

      return {
        ...prevDetails,
        comments: [...prevDetails.comments, newComment],
        _count: {
          ...prevDetails._count,
          comments: prevDetails._count.comments + 1,
        },
      };
    });

    setSelectedPost((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        _count: {
          ...prev._count,
          comments: prev._count.comments + 1,
        },
      };
    });

    await addComment(selectedPost.id, content);
    commentFormRef.current?.reset();
    
    setShowAllComments(true); 
    fetchPostDetails(selectedPost.id);
  };

  const currentModalPost = postDetails || selectedPost;
  const isCurrentPostLiked = currentModalPost?.likes.some(
    (l) => l.userId === currentUserId
  );
  
  const shouldShowCommentsList = 
    showAllComments || 
    (postDetails && postDetails.comments.length === 0 && !isFetchingDetails);

  return (
    <div className="bg-black min-vh-100 text-white">
      <Navbar
        expand="lg"
        className="bg-dark border-bottom border-secondary border-opacity-25 sticky-top"
        style={{
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(20, 20, 20, 0.95)",
          height: "70px",
          zIndex: 1020,
        }}
      >
        <Container>
          <Navbar.Brand
            href="/home"
            className="fw-bold text-white fs-3 me-5 d-flex align-items-center gap-2"
          >
            Corclo
          </Navbar.Brand>

          <div
            className="flex-grow-1 d-none d-md-block mx-auto position-relative"
            style={{ maxWidth: "500px" }}
          >
            <div className="position-relative">
              <Search
                className="position-absolute text-secondary"
                size={18}
                style={{ top: 12, left: 20, zIndex: 5 }}
              />
              <Form.Control
                type="text"
                name="searchQuery"
                placeholder="Jelajahi ide baru..."
                className="bg-black border-secondary border-opacity-25 text-white rounded-pill ps-5 py-2"
                style={{ boxShadow: "none", fontSize: "0.95rem" }}
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
              />
            </div>
          </div>

          <div className="d-flex align-items-center gap-3 ms-auto">
            <Link href={`/profile/${currentUser.username}`}>
              <img
                src={currentUser.avatar || "/images/default-avatar.png"}
                alt="profile"
                width={42}
                height={42}
                className="rounded-circle"
                style={{
                  border: "2px solid #7c3aed",
                  objectFit: "cover",
                  cursor: "pointer",
                  width: 42,
                  height: 42,
                }}
              />
            </Link>
          </div>
        </Container>
      </Navbar>

      <Container className="py-4">
        <Row className="g-4">
          <Col lg={3} className="d-none d-lg-block">
            <div className="sticky-top" style={{ top: "90px" }}>
              <Card className="bg-dark border-0 rounded-4 mb-3 overflow-hidden">
                <Card.Body className="p-2">
                  <Nav className="flex-column gap-1">
                    {[
                      { icon: Home, label: "Home", href: "/home" },
                      {
                        icon: Hash,
                        label: "Explore",
                        href: "/explore",
                        active: true,
                      },
                      { icon: Bell, label: "Notifications", href: "#" },
                      {
                        icon: MessageCircle,
                        label: "Messages",
                        href: "/messages",
                      },
                      { icon: Bookmark, label: "Bookmarks", href: "#" },
                      {
                        icon: User,
                        label: "Profile",
                        href: `/profile/${currentUser.username}`,
                      },
                      { icon: Settings, label: "Settings", href: "#" },
                    ].map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className={`nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-3 transition-all ${
                          item.active
                            ? "text-primary fw-bold bg-primary bg-opacity-10"
                            : "text-secondary hover-bg-opacity"
                        }`}
                        style={{ transition: "0.2s" }}
                      >
                        <item.icon size={20} strokeWidth={2} />
                        <span style={{ fontSize: "0.95rem" }}>
                          {item.label}
                        </span>
                      </Link>
                    ))}
                  </Nav>
                </Card.Body>
              </Card>

              <Card className="bg-dark border-0 rounded-4">
                <Card.Body className="p-2">
                  <form action={logout}>
                    <button
                      type="submit"
                      className="btn w-100 d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-danger hover-bg-danger-subtle border-0 bg-transparent"
                    >
                      <LogOut size={20} />
                      <span
                        className="fw-bold"
                        style={{ fontSize: "0.95rem" }}
                      >
                        Log Out
                      </span>
                    </button>
                  </form>
                </Card.Body>
              </Card>
            </div>
          </Col>

          <Col lg={9} md={12}>
            <div className="mb-4 d-flex align-items-center gap-3">
              <Button
                variant="light"
                className="rounded-pill px-4 fw-bold border-0 text-black"
                style={{ backgroundColor: "white", whiteSpace: "nowrap" }}
                disabled
              >
                <Zap size={16} className="me-2" />
                Populer
              </Button>
              <h5
                className="fw-bold m-0 d-flex align-items-center text-secondary"
                style={{ cursor: "default", userSelect: "none" }}
              >
                Jelajahi Postingan
              </h5>
            </div>

            <ResponsiveMasonry
              columnsCountBreakPoints={{ 350: 2, 750: 3, 900: 3 }}
            >
              <Masonry gutter="16px">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="position-relative group cursor-pointer overflow-hidden rounded-4 masonry-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleOpenModal(post)}
                  >
                    <div className="position-relative">
                      {post.mediaType === "VIDEO" ? (
                        <div className="position-relative">
                          <video
                            src={post.mediaUrl || ""}
                            className="w-100 h-100 object-fit-cover rounded-4"
                            muted
                            loop
                            onMouseOver={(e) => e.currentTarget.play()}
                            onMouseOut={(e) => {
                              e.currentTarget.pause();
                              e.currentTarget.currentTime = 0;
                            }}
                          />
                          <div className="position-absolute top-0 end-0 p-2">
                            <Play size={20} fill="white" stroke="none" />
                          </div>
                        </div>
                      ) : (
                        <img
                          src={post.mediaUrl || "/images/placeholder.jpg"}
                          alt="post"
                          className="w-100 h-auto rounded-4"
                          style={{ display: "block" }}
                          loading="lazy"
                        />
                      )}

                      <div
                        className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-end p-3 masonry-overlay"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                          opacity: 0,
                          transition: "opacity 0.2s ease-in-out",
                        }}
                      >
                        <style jsx>{`
                          .masonry-item:hover .masonry-overlay {
                            opacity: 1 !important;
                          }
                        `}</style>

                        <div className="d-flex align-items-center gap-2 mb-2">
                          <img
                            src={
                              post.author.avatar || "/images/default-avatar.png"
                            }
                            alt="avatar"
                            width={24}
                            height={24}
                            className="rounded-circle border border-white"
                            style={{ objectFit: 'cover' }}
                          />
                          <span className="small fw-bold text-white text-shadow">
                            {post.author.username}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between text-white">
                          <div className="d-flex align-items-center gap-1">
                            <Heart
                              size={16}
                              fill={
                                post.likes.some(
                                  (l) => l.userId === currentUserId
                                )
                                  ? "#ef4444"
                                  : "white"
                              }
                              className={
                                post.likes.some(
                                  (l) => l.userId === currentUserId
                                )
                                  ? "text-danger"
                                  : ""
                              }
                            />
                            <span className="small">{post._count.likes}</span>
                          </div>
                          <div className="d-flex align-items-center gap-1">
                            <MessageCircle size={16} />
                            <span className="small">
                              {post._count.comments}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Masonry>
            </ResponsiveMasonry>

            {filteredPosts.length === 0 && (
              <div className="text-center py-5">
                <h5 className="text-secondary">Tidak ada hasil ditemukan.</h5>
              </div>
            )}
          </Col>
        </Row>
      </Container>

      <Modal
        show={!!selectedPost}
        onHide={handleCloseModal}
        centered
        size="lg"
        contentClassName="bg-black text-white border border-secondary border-opacity-25 rounded-4 overflow-hidden"
      >
        {currentModalPost && (
          <Modal.Body className="p-0">
            <Row className="g-0">
              <Col md={7} className="bg-dark d-flex align-items-center">
                {currentModalPost.mediaType === "VIDEO" ? (
                  <video
                    src={currentModalPost.mediaUrl || ""}
                    controls
                    autoPlay
                    className="w-100 h-100"
                    style={{ maxHeight: "600px" }}
                  />
                ) : (
                  <img
                    src={currentModalPost.mediaUrl || ""}
                    className="w-100 h-100 object-fit-contain"
                    style={{ maxHeight: "600px", minHeight: "300px" }}
                  />
                )}
              </Col>
              <Col
                md={5}
                className="d-flex flex-column"
                style={{ maxHeight: "600px" }}
              >
                <div className="p-3 border-bottom border-secondary border-opacity-25 d-flex align-items-center justify-content-between">
                  <Link
                    href={`/profile/${currentModalPost.author.username}`}
                    className="d-flex align-items-center gap-2 text-white text-decoration-none"
                    onClick={handleCloseModal}
                  >
                    <img
                      src={
                        currentModalPost.author.avatar ||
                        "/images/default-avatar.png"
                      }
                      width={32}
                      height={32}
                      className="rounded-circle"
                      alt="avatar"
                      style={{ objectFit: 'cover' }}
                    />
                    <span className="fw-bold">
                      {currentModalPost.author.username}
                    </span>
                  </Link>
                  <Button
                    variant="link"
                    className="text-white p-0"
                    onClick={handleCloseModal}
                  >
                    Close
                  </Button>
                </div>

                <div className="p-3 flex-grow-1 overflow-y-auto custom-scrollbar">
                  <p className="mb-3">{currentModalPost.content}</p>

                  <div className="mt-3">
                    {shouldShowCommentsList ? (
                      isFetchingDetails ? (
                        <div className="text-center text-secondary small">
                          Memuat komentar...
                        </div>
                      ) : (currentModalPost as PostDetailType).comments?.length > 0 ? (
                        (currentModalPost as PostDetailType).comments.map(
                          (comment) => (
                            <div key={comment.id} className="mb-2 d-flex gap-2">
                              <Link
                                href={`/profile/${comment.user.username}`}
                                onClick={handleCloseModal}
                              >
                                <img
                                  src={
                                    comment.user.avatar ||
                                    "/images/default-avatar.png"
                                  }
                                  width={24}
                                  height={24}
                                  className="rounded-circle"
                                  alt={`${comment.user.username} avatar`}
                                  style={{ objectFit: 'cover' }}
                                />
                              </Link>
                              <div>
                                <Link
                                  href={`/profile/${comment.user.username}`}
                                  className="fw-bold small me-1 text-white text-decoration-none"
                                  onClick={handleCloseModal}
                                >
                                  {comment.user.username}
                                </Link>
                                <span className="small text-white">
                                  {comment.content}
                                </span>
                              </div>
                            </div>
                          )
                        )
                      ) : (
                        <div className="text-center text-secondary small">
                          Belum ada komentar.
                        </div>
                      )
                    ) : null}
                  </div>
                </div>

                <div className="p-3 border-top border-secondary border-opacity-25 bg-dark bg-opacity-50">
                  <div className="d-flex gap-4 mb-2 align-items-center">
                    <Heart
                      size={24}
                      className={`cursor-pointer transition-colors ${isPending ? 'opacity-50' : ''}`}
                      fill={isCurrentPostLiked ? "#ef4444" : "transparent"}
                      stroke={isCurrentPostLiked ? "#ef4444" : "white"}
                      onClick={() => !isPending && handleToggleLike(currentModalPost.id)}
                      style={{ cursor: isPending ? "not-allowed" : "pointer" }}
                    />
                    <MessageCircle size={24} style={{ cursor: "pointer" }} />
                  </div>
                  <div className="fw-bold small mb-1">
                    {currentModalPost._count.likes} Likes
                  </div>
                  <small 
                    className="text-secondary"
                    onClick={handleToggleComments}
                    style={{ cursor: currentModalPost._count.comments > 0 || postDetails?.comments.length === 0 ? 'pointer' : 'default' }}
                  >
                    {showAllComments
                      ? `Sembunyikan ${currentModalPost._count.comments} komentar`
                      : `Lihat semua ${currentModalPost._count.comments} komentar`}
                  </small>

                  <hr className="border-secondary border-opacity-25 my-2" />

                  <form ref={commentFormRef} action={handleAddComment}>
                    <div className="d-flex gap-2">
                      <Form.Control
                        type="text"
                        name="commentContent"
                        placeholder="Tulis komentar..."
                        className="bg-black border-secondary border-opacity-25 text-white flex-grow-1"
                        style={{ boxShadow: "none" }}
                        disabled={isPending}
                      />
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isPending || !currentModalPost}
                      >
                        Kirim
                      </Button>
                    </div>
                  </form>
                </div>
              </Col>
            </Row>
          </Modal.Body>
        )}
      </Modal>
    </div>
  );
}