"use client";

import { updateProfile } from "@/app/actions";
import { Camera, X } from "lucide-react";
import { useState } from "react";
import { Button, Form, Image, Modal, Alert } from "react-bootstrap";
import { useFormStatus } from "react-dom";

type EditProfileModalProps = {
  show: boolean;
  handleClose: () => void;
  user: {
    name: string;
    username: string;
    avatar: string | null;
    bio: string | null;
  };
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="primary"
      className="fw-bold px-4 rounded-pill"
      style={{ backgroundColor: "#7c3aed", border: "none" }}
      disabled={pending}
    >
      {pending ? "Menyimpan..." : "Simpan"}
    </Button>
  );
}

export default function EditProfileModal({
  show,
  handleClose,
  user,
}: EditProfileModalProps) {
  const [preview, setPreview] = useState<string | null>(user.avatar);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setErrorMsg(null);
    try {
      await updateProfile(formData);
      handleClose();
      setPreview(null);
    } catch (error: any) {
      if (error.message === "NEXT_REDIRECT") {
        return;
      }
      setErrorMsg(error.message || "Terjadi kesalahan saat menyimpan.");
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      contentClassName="bg-dark text-white border border-secondary border-opacity-25 rounded-4"
    >
      <Modal.Header className="border-bottom border-secondary border-opacity-25">
        <Modal.Title className="fw-bold">Edit Profil</Modal.Title>
        <Button variant="link" onClick={handleClose} className="text-white">
          <X size={24} />
        </Button>
      </Modal.Header>

      <Modal.Body className="p-4">
        {errorMsg && (
          <Alert variant="danger" className="mb-3 py-2 small fw-bold">
            {errorMsg}
          </Alert>
        )}

        <form action={handleSubmit}>
          <div className="d-flex justify-content-center mb-4 position-relative">
            <div className="position-relative">
              <Image
                src={preview || "/images/default-avatar.png"}
                roundedCircle
                width={100}
                height={100}
                style={{ objectFit: "cover", border: "2px solid #7c3aed" }}
              />
              <label
                className="position-absolute bottom-0 end-0 bg-dark rounded-circle p-2 border border-secondary cursor-pointer hover-bg-light-dark"
                style={{ cursor: "pointer" }}
              >
                <Camera size={16} className="text-white" />
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  className="d-none"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label className="text-secondary small fw-bold">Nama</Form.Label>
            <Form.Control
              type="text"
              name="name"
              defaultValue={user.name}
              className="bg-black text-white border-secondary"
              placeholder="Nama Lengkap"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-secondary small fw-bold">Bio</Form.Label>
            <Form.Control
              as="textarea"
              name="bio"
              defaultValue={user.bio || ""}
              className="bg-black text-white border-secondary"
              placeholder="Ceritakan sedikit tentang dirimu..."
              rows={3}
              maxLength={160}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="text-secondary small fw-bold">Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              defaultValue={user.username}
              className="bg-black text-white border-secondary"
              placeholder="username"
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <SubmitButton />
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
