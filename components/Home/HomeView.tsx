"use client";

import { createPost, logout, searchUsers, toggleFollow } from "@/app/actions";
import PostList, { PostWithRelations } from "@/components/Feed/PostList";
import {
  Bell,
  Bookmark,
  Hash,
  Home,
  Image as ImageIcon,
  LogOut,
  MessageCircle,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  ListGroup,
  Nav,
  Navbar,
  Row,
} from "react-bootstrap";
import { useFormStatus } from "react-dom";

type UserProfileData = {
  id: number;
  name: string;
  username: string;
  avatar: string | null;
  _count: {
    posts: number;
    followedBy: number;
    following: number;
  };
};

type SearchResultUser = {
  id: number;
  name: string;
  username: string;
  avatar: string | null;
};

type HomeViewProps = {
  currentUser: UserProfileData;
  allPosts: PostWithRelations[];
  currentUserId: number;
  suggestions: {
    id: number;
    name: string;
    username: string;
    avatar: string | null;
  }[];
  storySection: React.ReactNode;
};

export default function HomeView({
  currentUser,
  allPosts,
  currentUserId,
  suggestions,
  storySection,
}: HomeViewProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      setIsSearching(true);
      const results = await searchUsers(query);
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setFileType(file.type.startsWith("video") ? "video" : "image");
    }
  };

  const clearFile = () => {
    setPreview(null);
    setFileType(null);
    const input = document.getElementById("mediaInput") as HTMLInputElement;
    if (input) input.value = "";
  };

  function TombolPosting() {
    const { pending } = useFormStatus();
    return (
      <Button
        type="submit"
        className="rounded-pill px-4 fw-bold text-white"
        style={{
          background: "linear-gradient(90deg, #7c3aed, #6d28d9)",
          border: "none",
        }}
        disabled={pending}
      >
        {pending ? "..." : "Posting"}
      </Button>
    );
  }

  return (
    <div className="bg-black min-vh-100 text-white" suppressHydrationWarning={true}>
      <Navbar
        expand="lg"
        className="bg-dark border-bottom border-secondary border-opacity-25 sticky-top"
        style={{
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(20, 20, 20, 0.95)",
          height: "70px",
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
                placeholder="Cari di Corclo..."
                className="bg-black border-secondary border-opacity-25 text-white rounded-pill ps-5 py-2"
                style={{ boxShadow: "none", fontSize: "0.95rem" }}
                value={searchQuery}
                onChange={handleSearch}
                autoComplete="off"
              />
            </div>

            {searchQuery && (
              <div
                className="position-absolute w-100 mt-2 rounded-4 overflow-hidden shadow-lg"
                style={{
                  backgroundColor: "#1e1e1e",
                  border: "1px solid rgba(255,255,255,0.1)",
                  zIndex: 1000,
                }}
              >
                {isSearching ? (
                  <div className="p-3 text-center text-secondary small">
                    Mencari...
                  </div>
                ) : searchResults.length > 0 ? (
                  <ListGroup variant="flush">
                    {searchResults.map((user) => (
                      <Link
                        key={user.id}
                        href={`/profile/${user.username}`}
                        className="text-decoration-none"
                        onClick={() => {
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                      >
                        <ListGroup.Item
                          className="bg-transparent text-white border-secondary border-opacity-10 d-flex align-items-center gap-3 px-3 py-2 action-hover"
                          style={{ cursor: "pointer" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "rgba(255,255,255,0.05)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "transparent")
                          }
                        >
                          <Image
                            src={user.avatar || "/images/default-avatar.png"}
                            roundedCircle
                            width={36}
                            height={36}
                            alt={user.username}
                            style={{ objectFit: "cover" }}
                          />
                          <div>
                            <div className="fw-bold small">{user.name}</div>
                            <div className="text-secondary small">
                              @{user.username}
                            </div>
                          </div>
                        </ListGroup.Item>
                      </Link>
                    ))}
                  </ListGroup>
                ) : (
                  <div className="p-3 text-center text-secondary small">
                    Tidak ada pengguna ditemukan.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="d-flex align-items-center gap-3 ms-auto">
            <Link href={`/profile/${currentUser.username}`}>
              <Image
                src={currentUser.avatar || "/images/default-avatar.png"}
                roundedCircle
                width={42}
                height={42}
                alt="profile"
                style={{
                  border: "2px solid #7c3aed",
                  objectFit: "cover",
                  cursor: "pointer",
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
                      {
                        icon: Home,
                        label: "Home",
                        href: "/home",
                        active: true,
                      },
                      { icon: Hash, label: "Explore", href: "/explore" },
                      { icon: Bell, label: "Notifications", href: "#" },
                      { icon: MessageCircle, label: "Messages", href: "/messages" },
                      { icon: Bookmark, label: "Bookmarks", href: "/bookmarks" },
                      {
                        icon: User,
                        label: "Profile",
                        href: `/profile/${currentUser.username}`,
                      },
                      { icon: Settings, label: "Settings", href: "/settings" },
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
                      <span className="fw-bold" style={{ fontSize: "0.95rem" }}>
                        Log Out
                      </span>
                    </button>
                  </form>
                </Card.Body>
              </Card>
            </div>
          </Col>

          <Col lg={6} md={12}>
            {/* RENDER STORY DISINI */}
            {storySection}

            <Card className="bg-dark border-0 rounded-4 mb-4 shadow-sm">
              <Card.Body className="p-3">
                <form action={createPost}>
                  <div className="d-flex gap-3 mb-3">
                    <Link href={`/profile/${currentUser.username}`}>
                      <Image
                        src={currentUser.avatar || "/images/default-avatar.png"}
                        roundedCircle
                        width={48}
                        height={48}
                        alt="user"
                        style={{ objectFit: "cover", cursor: "pointer" }}
                      />
                    </Link>
                    <Form.Control
                      name="content"
                      as="textarea"
                      rows={2}
                      placeholder={`Apa yang sedang terjadi, ${
                        currentUser.name.split(" ")[0]
                      }?`}
                      className="bg-transparent border-0 text-white p-2 fs-5"
                      style={{ resize: "none", boxShadow: "none" }}
                    />
                  </div>

                  {preview && (
                    <div className="position-relative mb-3 fit-content d-inline-block">
                      <Button
                        variant="dark"
                        size="sm"
                        className="position-absolute top-0 end-0 m-1 rounded-circle p-1"
                        onClick={clearFile}
                        style={{ zIndex: 10 }}
                      >
                        <X size={14} />
                      </Button>
                      {fileType === "image" ? (
                        <img
                          src={preview}
                          className="rounded-3"
                          style={{ maxHeight: "200px" }}
                        />
                      ) : (
                        <video
                          src={preview}
                          controls
                          className="rounded-3"
                          style={{ maxHeight: "200px" }}
                        />
                      )}
                    </div>
                  )}

                  <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-10">
                    <div className="d-flex gap-3">
                      <label className="btn btn-link text-decoration-none p-0 d-flex align-items-center gap-2 text-secondary hover-text-primary">
                        <ImageIcon size={20} className="text-success" />
                        <span className="small fw-bold">Foto / Video</span>
                        <input
                          id="mediaInput"
                          type="file"
                          name="media"
                          accept="image/*,video/*"
                          className="d-none"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    <TombolPosting />
                  </div>
                </form>
              </Card.Body>
            </Card>

            <PostList posts={allPosts} currentUserId={currentUserId} />
          </Col>

          <Col lg={3} className="d-none d-lg-block">
            <div className="sticky-top" style={{ top: "90px" }}>
              <Card className="bg-dark border-0 rounded-4 mb-4 text-center p-3">
                <div className="mb-3">
                  <Link href={`/profile/${currentUser.username}`}>
                    <Image
                      src={currentUser.avatar || "/images/default-avatar.png"}
                      roundedCircle
                      width={60}
                      height={60}
                      alt="profile"
                      style={{
                        objectFit: "cover",
                        border: "2px solid #7c3aed",
                        padding: "2px",
                        cursor: "pointer",
                      }}
                    />
                  </Link>
                </div>
                <Link
                  href={`/profile/${currentUser.username}`}
                  className="text-decoration-none text-white"
                >
                  <h6 className="fw-bold mb-0 hover-underline">
                    {currentUser.name}
                  </h6>
                </Link>
                <Link
                  href={`/profile/${currentUser.username}`}
                  className="text-decoration-none"
                >
                  <small className="text-secondary mb-3 d-block hover-underline">
                    @{currentUser.username}
                  </small>
                </Link>

                <div className="d-flex justify-content-center gap-4 text-center">
                  <div>
                    <span className="fw-bold d-block text-white">
                      {currentUser._count.posts}
                    </span>
                    <small
                      className="text-secondary"
                      style={{ fontSize: "11px" }}
                    >
                      Posts
                    </small>
                  </div>
                  <div>
                    <span className="fw-bold d-block text-white">
                      {currentUser._count.followedBy}
                    </span>
                    <small
                      className="text-secondary"
                      style={{ fontSize: "11px" }}
                    >
                      Followers
                    </small>
                  </div>
                  <div>
                    <span className="fw-bold d-block text-white">
                      {currentUser._count.following}
                    </span>
                    <small
                      className="text-secondary"
                      style={{ fontSize: "11px" }}
                    >
                      Following
                    </small>
                  </div>
                </div>
              </Card>

              <Card className="bg-dark border-0 rounded-4 p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0" style={{ fontSize: "0.9rem" }}>
                    Disarankan untukmu
                  </h6>
                </div>
                <div className="d-flex flex-column gap-3">
                  {suggestions.map((user) => (
                    <div
                      key={user.id}
                      className="d-flex align-items-center justify-content-between"
                    >
                      <div className="d-flex align-items-center gap-2">
                        <Link href={`/profile/${user.username}`}>
                          <Image
                            src={user.avatar || "/images/default-avatar.png"}
                            roundedCircle
                            width={36}
                            height={36}
                            style={{ objectFit: "cover", cursor: "pointer" }}
                          />
                        </Link>

                        <div style={{ lineHeight: "1.1" }}>
                          <Link
                            href={`/profile/${user.username}`}
                            className="text-decoration-none"
                          >
                            <p
                              className="mb-0 fw-bold small text-white lh-sm hover-underline"
                              style={{
                                maxWidth: "110px",
                                wordWrap: "break-word",
                                whiteSpace: "normal",
                                cursor: "pointer",
                              }}
                            >
                              {user.name}
                            </p>
                          </Link>

                          <Link
                            href={`/profile/${user.username}`}
                            className="text-decoration-none"
                          >
                            <small
                              className="text-secondary hover-underline"
                              style={{ fontSize: "10px", cursor: "pointer" }}
                            >
                              @{user.username}
                            </small>
                          </Link>
                        </div>
                      </div>
                      <Button
                        variant="link"
                        className="text-primary fw-bold p-0 small text-decoration-none"
                        style={{ fontSize: "12px" }}
                        onClick={() => toggleFollow(user.id)}
                      >
                        Ikuti
                      </Button>
                    </div>
                  ))}
                  {suggestions.length === 0 && (
                    <small className="text-secondary text-center">
                      Tidak ada saran saat ini.
                    </small>
                  )}
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}