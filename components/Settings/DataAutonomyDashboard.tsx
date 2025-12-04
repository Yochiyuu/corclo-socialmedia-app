"use client";

import { exportUserData } from "@/app/actions";
import { format } from "date-fns";
import { Code, Download, Eye, Shield } from "lucide-react";
import Link from "next/link";
import { Card, Button, ListGroup } from "react-bootstrap";

type DashboardProps = {
  feedLogs: any[];
  totalViews: number;
  attentionRatio: number;
  interactionLogs: number;
};

export default function DataAutonomyDashboard({
  feedLogs,
  totalViews,
  attentionRatio,
  interactionLogs,
}: DashboardProps) {
  return (
    <>
        <h3 className="fw-bold mb-4 d-flex align-items-center gap-2">
            <Shield size={24} className="text-primary" /> Dasbor Otonomi Data
        </h3>
        <p className="text-secondary lead mb-4 small">
            Verifikasi klaim Anti-Algoritma dan kelola kedaulatan data Anda.
        </p>

        {/* --- Metrik Anti-Algoritma --- */}
        <Card className="mb-4 bg-dark border-secondary border-opacity-25">
            <Card.Header className="fw-bold bg-dark text-white border-secondary border-opacity-25">
                Metrik Kualitas Jaringan
            </Card.Header>
            <Card.Body className="d-flex justify-content-around text-center p-4">
                <div className="flex-fill">
                    <h4 className="fw-bold text-primary mb-0">{totalViews}</h4>
                    <small className="text-secondary">Log View Terakhir</small>
                </div>
                <div className="flex-fill border-start border-end border-secondary border-opacity-25 mx-2">
                    <h4 className="fw-bold text-success mb-0">
                        {attentionRatio.toFixed(2)}%
                    </h4>
                    <small className="text-secondary">Rasio Perhatian Murni</small>
                </div>
                <div className="flex-fill">
                    <h4 className="fw-bold text-info mb-0">{interactionLogs}</h4>
                    <small className="text-secondary">Total Interaksi Aktif</small>
                </div>
            </Card.Body>
        </Card>

        {/* --- Log Transparansi Feed (Bukti Kronologis) --- */}
        <Card className="mb-4 bg-dark border-secondary border-opacity-25">
            <Card.Header className="fw-bold bg-dark border-secondary border-opacity-25 d-flex align-items-center gap-2">
                <Eye size={20} /> Log Transparansi Feed ({feedLogs.length} Postingan Terakhir Dilihat)
            </Card.Header>
            <ListGroup variant="flush">
                {feedLogs.length > 0 ? (
                feedLogs.map((log, index) => (
                    <ListGroup.Item
                    key={index}
                    className="bg-transparent text-white border-secondary border-opacity-10 d-flex justify-content-between p-3"
                    >
                    <div>
                        {log.targetPost ? (
                        <>
                            <p className="mb-0 small">
                            Anda melihat Postingan dari{" "}
                            <Link
                                href={`/profile/${log.targetPost.author.username}`}
                                className="text-primary fw-bold text-decoration-none"
                            >
                                @{log.targetPost.author.username}
                            </Link>
                            </p>
                            <small className="text-success fw-bold">
                            Alasan: Aturan Feed Kronologis Murni.
                            </small>
                        </>
                        ) : (
                        <small className="text-danger">
                            Log View tidak terhubung ke Postingan.
                        </small>
                        )}
                    </div>
                    <small className="text-secondary text-end">
                        {format(new Date(log.timestamp), "dd MMM, HH:mm")}
                    </small>
                    </ListGroup.Item>
                ))
                ) : (
                <ListGroup.Item className="bg-transparent text-secondary text-center p-4">
                    Mulai jelajahi feed Anda untuk melihat log.
                </ListGroup.Item>
                )}
            </ListGroup>
        </Card>

        {/* --- Toolkit Kedaulatan Data --- */}
        <Card className="bg-dark border-secondary border-opacity-25">
            <Card.Header className="fw-bold bg-dark border-secondary border-opacity-25 d-flex align-items-center gap-2">
                <Code size={20} /> Toolkit Kedaulatan Data
            </Card.Header>
            <Card.Body className="bg-transparent p-4">
                <h5 className="fw-bold text-warning mb-3">Ekspor Semua Data</h5>
                <p className="text-secondary small">
                    Unduh salinan lengkap semua postingan, komentar, likes, dan log interaksi Anda.
                </p>
                <form action={exportUserData}>
                    <Button
                        variant="outline-primary"
                        type="submit"
                        className="rounded-pill px-4 d-flex align-items-center gap-2 border-primary text-primary hover-text-white"
                    >
                        <Download size={18} /> Unduh Data Saya
                    </Button>
                </form>
            </Card.Body>
        </Card>
    </>
  );
}