"use client";

import { searchUsers, startConversation } from "@/app/actions"; // Import startConversation
import { MessageCircle, Search } from "lucide-react"; // Import MessageCircle
import Link from "next/link";
import { useState } from "react";
import {
  Button,
  Container,
  Form,
  Image,
  ListGroup,
  Navbar,
} from "react-bootstrap"; // Import Button

type SearchResultUser = {
  id: number;
  name: string;
  username: string;
  avatar: string | null;
};

export default function AppHeader({
  currentUser,
}: {
  currentUser: { username: string; avatar: string | null };
}) {
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

  return (
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
              placeholder="Cari pengguna untuk chat..."
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
                    <ListGroup.Item
                      key={user.id}
                      className="bg-transparent text-white border-secondary border-opacity-10 d-flex align-items-center justify-content-between px-3 py-2 action-hover"
                    >
                      {/* Link ke Profil */}
                      <Link
                        href={`/profile/${user.username}`}
                        className="d-flex align-items-center gap-3 text-decoration-none flex-grow-1"
                        onClick={() => {
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
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
                          <div className="fw-bold small text-white">
                            {user.name}
                          </div>
                          <div className="text-secondary small">
                            @{user.username}
                          </div>
                        </div>
                      </Link>

                      {/* Tombol Chat Langsung */}
                      <Button
                        variant="link"
                        className="text-primary p-2"
                        onClick={() => {
                          startConversation(user.id);
                          setSearchQuery(""); // Tutup search setelah klik
                        }}
                      >
                        <MessageCircle size={20} />
                      </Button>
                    </ListGroup.Item>
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
  );
}