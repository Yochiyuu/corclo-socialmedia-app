"use client";

import { Bell, Hash, Home, MessageSquare, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "react-bootstrap";

const menuItems = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/explore", icon: Hash, label: "Explore" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
  { href: "/messages", icon: MessageSquare, label: "Messages" },
  { href: "/profile/me", icon: User, label: "Profile" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function LeftSidebar() {
  const pathname = usePathname();

  return (
    <div className="position-sticky" style={{ top: "80px" }}>
      <div className="d-flex flex-column gap-0">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                d-flex align-items-center gap-3 
                p-2 rounded-4
                text-decoration-none text-body
                ${isActive ? "fw-bold bg-body-tertiary" : "fw-medium"}
              `}
            >
              <Icon size={20} />
              <span className="fs-6">{item.label}</span>
            </Link>
          );
        })}
      </div>
      <Button variant="primary" size="lg" className="w-100 rounded-pill mt-3">
        Post
      </Button>
    </div>
  );
}
