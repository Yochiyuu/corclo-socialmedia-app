"use client";

import { exportUserData } from "@/app/actions";
import AppSidebar from "@/components/Layout/AppSidebar";
import { format } from "date-fns";
import { Code, Download, Eye, Shield } from "lucide-react";
import Link from "next/link";
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";

type CurrentUser = { username: string; avatar: string | null; name: string };

type AutonomyHubProps = {
  currentUser: CurrentUser;
  feedLogs: any[];
  totalViews: number;
  attentionRatio: number;
  interactionLogs: number;
};

export default function SettingsView({
  currentUser,
  feedLogs,
  totalViews,
  attentionRatio,
  interactionLogs,
}: AutonomyHubProps) {
  return (
    <Container className="py-4">
      <Row className="g-4">
        {/* SIDEBAR */}
        <Col lg={3} className="d-none d-lg-block">
          <div className="sticky-top" style={{ top: "90px" }}>
            <AppSidebar currentUser={currentUser} activePage="settings" />
          </div>
        </Col>

        {/* KONTEN UTAMA */}
        <Col lg={9} md={12}>
          <h2 className="fw-bold mb-4 d-flex align-items-center gap-2">
            <Shield size={32} className="text-primary" /> Dasbor Otonomi Data
          </h2>
          <p className="text-secondary lead mb-5">
            Verifikasi klaim Anti-Algoritma dan kelola kedaulatan data Anda.
          </p>

          {/* --- Bagian Metrik Anti-Algoritma --- */}
          <Card className="mb-4">
            <Card.Header className="fw-bold bg-dark border-secondary border-opacity-25">
              Metrik Kualitas Jaringan
            </Card.Header>
            <Card.Body className="d-flex justify-content-around text-center">
              <div>
                <h4 className="fw-bold text-primary mb-0">{totalViews}</h4>
                <small className="text-secondary">Log View Terakhir</small>
              </div>
              <div>
                <h4 className="fw-bold text-success mb-0">
                  {attentionRatio.toFixed(2)}%
                </h4>
                <small className="text-secondary">Rasio Perhatian Murni</small>
              </div>
              <div>
                <h4 className="fw-bold text-info mb-0">{interactionLogs}</h4>
                <small className="text-secondary">Total Interaksi Aktif</small>
              </div>
            </Card.Body>
          </Card>

          {/* --- Log Transparansi Feed (Bukti Kronologis) --- */}
          <Card className="mb-4">
            <Card.Header className="fw-bold bg-dark border-secondary border-opacity-25 d-flex align-items-center gap-2">
              <Eye size={20} /> Log Transparansi Feed ({feedLogs.length} Postingan Terakhir Dilihat)
            </Card.Header>
            <ListGroup variant="flush">
              {feedLogs.length > 0 ? (
                feedLogs.map((log, index) => (
                  <ListGroup.Item
                    key={index}
                    className="bg-transparent text-white border-secondary border-opacity-10 d-flex justify-content-between"
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
                <ListGroup.Item className="bg-transparent text-secondary text-center">
                  Mulai jelajahi feed Anda untuk melihat log.
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>

          {/* --- Toolkit Kedaulatan Data --- */}
          <Card>
            <Card.Header className="fw-bold bg-dark border-secondary border-opacity-25 d-flex align-items-center gap-2">
              <Code size={20} /> Toolkit Kedaulatan Data
            </Card.Header>
            <Card.Body className="bg-transparent">
              <h5 className="fw-bold text-warning mb-3">Ekspor Semua Data</h5>
              <p className="text-secondary small">
                Unduh salinan lengkap semua postingan, komentar, likes, dan log
                interaksi Anda. Ini membuktikan bahwa Anda adalah pemilik tunggal
                data Anda.
              </p>
              <form action={exportUserData}>
                <Button
                  variant="outline-primary"
                  type="submit"
                  className="rounded-pill px-4 d-flex align-items-center gap-2"
                >
                  <Download size={18} /> Unduh Data Saya
                </Button>
              </form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}