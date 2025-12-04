"use client";

import { logout } from "@/app/actions";
import {
  Bell,
  Bookmark,
  Hash,
  Home,
  LogOut,
  MessageCircle,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { Card, Nav } from "react-bootstrap";

export default function AppSidebar({
  currentUser,
  activePage,
}: {
  currentUser: { username: string };
  activePage: string;
}) {
  return (
    <>
      <Card className="bg-dark border-0 rounded-4 mb-3 overflow-hidden shadow-sm">
        <Card.Body className="p-2">
          <Nav className="flex-column gap-1">
            {[
              {
                icon: Home,
                label: "Home",
                href: "/home",
                active: activePage === "home",
              },
              { icon: Hash, label: "Explore", href: "#", active: false },
              { icon: Bell, label: "Notifications", href: "#", active: false },
              {
                icon: MessageCircle,
                label: "Messages",
                href: "/messages",
                active: activePage === "messages",
              },
              { icon: Bookmark, label: "Bookmarks", href: "#", active: false },
              {
                icon: User,
                label: "Profile",
                href: `/profile/${currentUser.username}`,
                active: activePage === "profile",
              },
              { 
                icon: Settings, 
                label: "Settings", 
                href: "/settings",
                active: activePage === "settings"
              },
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
                <span style={{ fontSize: "0.95rem" }}>{item.label}</span>
              </Link>
            ))}
          </Nav>
        </Card.Body>
      </Card>

      <Card className="bg-dark border-0 rounded-4 shadow-sm">
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
    </>
  );
}