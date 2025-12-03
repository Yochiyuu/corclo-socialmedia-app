import { MessageCircle } from "lucide-react";

export default function MessagesPage() {
  return (
    <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center p-4">
      <div className="p-4 rounded-circle bg-dark bg-opacity-50 mb-3 border border-secondary border-opacity-25">
        <MessageCircle size={48} className="text-white" />
      </div>
      <h4 className="fw-bold mb-2">Pesan Anda</h4>
      <p className="text-secondary">
        Pilih percakapan untuk mulai berkirim pesan.
      </p>
    </div>
  );
}