"use client";

import Link from "next/link";
import { ChevronRight, X } from "lucide-react";
import { Form } from "react-bootstrap";
import { logout } from "@/app/actions";

type ActionButtonProps = {
    href: string;
    text: string;
    isDanger?: boolean;
    isSwitch?: boolean;
    isLogout?: boolean;
    variant?: string;
};

// Fungsi Client-Side untuk menentukan ikon berdasarkan prop
const getIconComponent = (text: string, isLogout: boolean) => {
    if (isLogout) return X;
    // Default
    return ChevronRight;
};

export default function SettingsActionItem({
    href,
    text,
    isDanger = false,
    isSwitch = false,
    isLogout = false,
    variant: Variant = 'secondary'
}: ActionButtonProps) {

    // Handler untuk Hapus Akun (logika sisi klien)
    const handleDeleteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (window.confirm('Yakin ingin menghapus akun? Aksi ini tidak dapat dibatalkan.')) {
            console.log('Account Deletion Confirmed.');
        }
    };

    // Pilih Icon berdasarkan logika Client Side
    const IconComponent = getIconComponent(text, isLogout);
    const itemClassName = isDanger ? 'text-danger' : 'text-white';
    const iconClassName = isDanger ? 'danger' : Variant;


    // Khusus untuk tombol Logout (menggunakan form action)
    if (isLogout) {
        return (
            <form action={logout}>
                <button
                    type="submit"
                    // Menggunakan ListGroup styling
                    className={`list-group-item bg-transparent w-100 d-flex justify-content-between align-items-center py-3 hover-bg-opacity border-secondary border-opacity-10 ${itemClassName}`}
                >
                    <span className="fw-bold">{text}</span>
                    <IconComponent size={18} className={`text-${iconClassName}`} />
                </button>
            </form>
        );
    }

    // Link Navigasi Umum (untuk Hapus Akun, Edit Profil, dll)
    return (
        <Link
            href={href}
            className={`list-group-item bg-transparent d-flex justify-content-between align-items-center py-3 hover-bg-opacity border-secondary border-opacity-10 ${itemClassName}`}
            // Menerapkan logika interaktif di Client Side
            onClick={text === 'Hapus Akun' ? handleDeleteClick : undefined}
        >
            <span className="fw-bold">{text}</span>
            {isSwitch ? (
                <Form.Check type="switch" id={`${text}-switch`} defaultChecked className="ms-auto" />
            ) : (
                <IconComponent size={18} className={`text-${iconClassName}`} />
            )}
        </Link>
    );
}