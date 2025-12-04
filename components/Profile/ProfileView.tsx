"use client";

import { createPost, logout, toggleFollow } from "@/app/actions";
import PostList, { PostWithRelations } from "@/components/Feed/PostList";
import EditProfileModal from "./EditProfile"; 
import { 
  Image as ImageIcon, 
  X, 
  MapPin, 
  Calendar, 
  Link as LinkIcon, 
  MoreHorizontal,
  Ghost,
  Heart,
  MessageSquare,
  Camera
} from "lucide-react";
import { useState } from "react";
import { Button, Container, Form, Image, Nav, Dropdown } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

type UserProfileData = {
  id: number;
  name: string;
  username: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  _count: {
    posts: number;
    followedBy: number;
    following: number;
  };
  posts: any[];
  likes: any[];
  comments: any[];
};

export default function ProfileView({
  user,
  isOwnProfile,
  currentUserId,
  isFollowing,
}: {
  user: UserProfileData;
  isOwnProfile: boolean;
  currentUserId: number;
  isFollowing?: boolean;
}) {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [showEditModal, setShowEditModal] = useState(false);

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
        className="px-4 fw-bold rounded-pill"
        style={{ 
          backgroundColor: "#7c3aed", 
          border: "none",
          transition: "all 0.2s"
        }}
        disabled={pending}
      >
        {pending ? "..." : "Posting"}
      </Button>
    );
  }

  const postsData: PostWithRelations[] = user.posts.map((post: any) => ({
    ...post,
    authorId: user.id,
    author: {
      name: user.name,
      username: user.username,
      avatar: user.avatar,
    },
  }));

  const mediaData = postsData.filter((post) => post.mediaUrl !== null);

  const likesData: PostWithRelations[] = user.likes.map((like: any) => ({
    ...like.post,
    authorId: like.post.authorId,
    author: like.post.author,
  }));
  
  const uniqueReplyIds = new Set();
  const repliesData: PostWithRelations[] = [];
  user.comments.forEach((comment: any) => {
    if (!uniqueReplyIds.has(comment.post.id)) {
        uniqueReplyIds.add(comment.post.id);
        repliesData.push({
            ...comment.post,
            authorId: comment.post.authorId,
            author: comment.post.author
        });
    }
  });

  const renderContent = () => {
    let data: PostWithRelations[] = [];
    let EmptyIcon = Ghost;
    let title = "";
    let subtitle = "";

    switch (activeTab) {
        case "posts":
            data = postsData;
            EmptyIcon = Ghost;
            title = "Belum ada postingan";
            subtitle = isOwnProfile ? "Ayo mulai buat cerita pertamamu!" : "User ini belum memposting apapun.";
            break;
        case "replies":
            data = repliesData;
            EmptyIcon = MessageSquare;
            title = "Belum ada balasan";
            subtitle = "Komentar yang diberikan akan muncul di sini.";
            break;
        case "media":
            data = mediaData;
            EmptyIcon = Camera;
            title = "Belum ada media";
            subtitle = "Foto dan video akan tersimpan di sini.";
            break;
        case "likes":
            data = likesData;
            EmptyIcon = Heart;
            title = "Belum ada Likes";
            subtitle = "Postingan yang disukai akan muncul di sini.";
            break;
        default:
            data = postsData;
    }

    if (data.length === 0) {
        return (
            <div className="text-center py-5 mt-4">
                <div className="bg-dark bg-opacity-50 p-4 rounded-circle d-inline-block mb-3">
                  <EmptyIcon size={40} className="text-secondary opacity-50" />
                </div>
                <h5 className="fw-bold text-white mb-1">{title}</h5>
                <p className="text-secondary small">{subtitle}</p>
            </div>
        );
    }

    return <PostList posts={data} currentUserId={currentUserId} />;
  };

  return (
    <section className="min-vh-100 bg-black text-white pb-5">
      <div 
        style={{ 
          height: "250px", 
          background: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #2e1065 100%)",
          position: "relative"
        }}
      />

      <Container>
        <div className="px-3">
          <div className="d-flex justify-content-between align-items-end" style={{ marginTop: "-90px" }}>
            <div className="position-relative">
              <Image
                src={user.avatar || "/images/default-avatar.png"}
                alt={user.name}
                roundedCircle
                width={160}
                height={160}
                className="bg-black"
                style={{ 
                  border: "5px solid #000",
                  objectFit: "cover",
                  cursor: "pointer"
                }}
              />
            </div>
            
            <div className="mb-3 d-flex gap-2">
              <Button
                variant="light"
                className="rounded-pill fw-bold"
                onClick={() => router.push('/home')}
              >
                Home
              </Button>
              {!isOwnProfile ? (
                <>
                  <Dropdown>
                    <Dropdown.Toggle variant="dark" className="rounded-circle border border-secondary p-2 no-arrow bg-transparent">
                      <MoreHorizontal size={20} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu variant="dark">
                      <Dropdown.Item>Report @{user.username}</Dropdown.Item>
                      <Dropdown.Item>Block</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Button
                    variant={isFollowing ? "outline-light" : "light"}
                    onClick={() => toggleFollow(user.id)}
                    className="fw-bold rounded-pill px-4"
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                </>
              ) : (
                <div className="d-flex gap-2">
                  <form action={logout}>
                    <Button variant="outline-danger" className="rounded-pill fw-bold" type="submit">
                      Log out
                    </Button>
                  </form>
                  <Button 
                    variant="outline-light" 
                    className="rounded-pill fw-bold" 
                    onClick={() => setShowEditModal(true)}
                  >
                    Edit Profile
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3">
            <h2 className="fw-bold mb-0 d-flex align-items-center gap-2">
              {user.name} 
              <span className="text-primary">
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                  <g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"></path></g>
                </svg>
              </span>
            </h2>
            <p className="text-secondary mb-3 fs-6">@{user.username}</p>

            <div className="text-light opacity-75 mb-3" style={{ maxWidth: "800px", fontSize: "1.05rem", whiteSpace: "pre-wrap" }}>
              {user.bio ? user.bio : <span className="text-secondary fst-italic">Belum ada bio.</span>}
            </div>

            <div className="d-flex flex-wrap gap-4 text-secondary mb-4">
              <span className="d-flex align-items-center gap-1">
                <MapPin size={18} /> Jakarta, ID
              </span>
              <span className="d-flex align-items-center gap-1">
                <LinkIcon size={18} /> corclo.com
              </span>
              <span className="d-flex align-items-center gap-1">
                <Calendar size={18} /> Joined Dec 2024
              </span>
            </div>

            <div className="d-flex gap-4 mb-2">
              <a 
                href={`/profile/${user.username}/following`} 
                className="text-decoration-none text-white d-flex align-items-center gap-1 hover-opacity"
                style={{ transition: "opacity 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
              >
                <b className="fs-5">{user._count.following}</b> 
                <span className="text-secondary">Following</span>
              </a>

              <a 
                href={`/profile/${user.username}/followers`}
                className="text-decoration-none text-white d-flex align-items-center gap-1 hover-opacity"
                style={{ transition: "opacity 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
              >
                <b className="fs-5">{user._count.followedBy}</b> 
                <span className="text-secondary">Followers</span>
              </a>
            </div>
          </div>
        </div>

        <div 
            className="border-bottom border-secondary border-opacity-25 mb-0 sticky-top z-3" 
            style={{ 
                top: "0px", 
                backgroundColor: "rgba(0, 0, 0, 0.75)", 
                backdropFilter: "blur(12px)", 
                WebkitBackdropFilter: "blur(12px)",
                marginRight: "-12px", 
                marginLeft: "-12px"
            }}
        >
          <Nav className="nav-justified" variant="underline">
            {['Posts', 'Replies', 'Media', 'Likes'].map((tab) => (
              <Nav.Item key={tab}>
                <Nav.Link 
                  eventKey={tab.toLowerCase()}
                  active={activeTab === tab.toLowerCase()}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`py-3 fw-bold transition-all ${activeTab === tab.toLowerCase() ? 'text-white' : 'text-secondary'}`}
                  style={{ 
                    borderRadius: 0, 
                    borderBottom: activeTab === tab.toLowerCase() ? '4px solid #7c3aed' : '4px solid transparent',
                    fontSize: '1rem'
                  }}
                >
                  {tab}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </div>

        <div className="row mt-3">
            <div className="col-lg-8 mx-auto">
                {isOwnProfile && activeTab === 'posts' && (
                <div className="d-flex gap-3 mb-4 p-3 border-bottom border-secondary border-opacity-25">
                    <Image
                        src={user.avatar || "/images/default-avatar.png"}
                        width={50}
                        height={50}
                        roundedCircle
                        style={{ objectFit: 'cover' }}
                    />
                    <div className="flex-grow-1">
                        <form action={createPost}>
                            <Form.Group className="mb-2">
                            <Form.Control
                                as="textarea"
                                name="content"
                                rows={2}
                                placeholder="Apa yang sedang terjadi?!"
                                className="bg-transparent text-white border-0 fs-5 p-0 focus-ring-none shadow-none"
                                style={{ resize: "none" }}
                            />
                            </Form.Group>

                            {preview && (
                            <div className="position-relative mb-3 fit-content d-inline-block animate-fade-in">
                                <Button
                                variant="dark"
                                size="sm"
                                className="position-absolute top-0 end-0 m-1 rounded-circle p-1 bg-black bg-opacity-75"
                                onClick={clearFile}
                                style={{ zIndex: 10 }}
                                >
                                <X size={14} />
                                </Button>
                                {fileType === "image" ? (
                                <img
                                    src={preview}
                                    className="rounded-4 border border-secondary border-opacity-25"
                                    style={{ maxHeight: "300px", maxWidth: "100%", objectFit: 'cover' }}
                                />
                                ) : (
                                <video
                                    src={preview}
                                    controls
                                    className="rounded-4 border border-secondary border-opacity-25"
                                    style={{ maxHeight: "300px", maxWidth: "100%" }}
                                />
                                )}
                            </div>
                            )}

                            <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25 mt-1">
                                <label
                                    className="text-primary d-flex align-items-center gap-2 p-2 rounded hover-bg-dark transition-colors"
                                    style={{ cursor: "pointer", fontSize: '0.9rem' }}
                                >
                                    <ImageIcon size={22} />
                                    <input
                                        id="mediaInput"
                                        type="file"
                                        name="media"
                                        accept="image/*,video/*"
                                        className="d-none"
                                        onChange={handleFileChange}
                                    />
                                </label>
                                <TombolPosting />
                            </div>
                        </form>
                    </div>
                </div>
                )}

                {renderContent()}
            </div>
        </div>

      </Container>

      {isOwnProfile && (
        <EditProfileModal 
          show={showEditModal} 
          handleClose={() => setShowEditModal(false)}
          user={{
            name: user.name,
            username: user.username,
            avatar: user.avatar,
            bio: user.bio
          }} 
        />
      )}

    </section>
  );
}
