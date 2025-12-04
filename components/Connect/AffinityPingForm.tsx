"use client";

import { useActionState } from "react";
import { sendAffinityPing } from "@/app/actions";
import { Alert, Button } from "react-bootstrap";
import { MessageCircle } from "lucide-react";

type AffinityFormState = {
    success: boolean;
    message: string;
} | undefined | null;

export default function AffinityPingForm({ targetUserId }: { targetUserId: number }) {
    const [state, formAction] = useActionState<AffinityFormState, FormData>(
        sendAffinityPing as (prevState: AffinityFormState, formData: FormData) => Promise<AffinityFormState>,
        null
    );

    return (
        <form action={formAction}>
            <input type="hidden" name="targetUserId" value={targetUserId} />

            {/* Menampilkan notifikasi keberhasilan/kegagalan */}
            {state && (
                <Alert
                    variant={state.success ? "success" : "danger"}
                    className="py-2 small mb-2"
                >
                    {state.message}
                </Alert>
            )}

            <Button
                variant="link"
                type="submit"
                className="w-100 btn-premium rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 text-decoration-none"
            >
                <MessageCircle size={18} /> Send Affinity Ping
            </Button>
        </form>
    );
}