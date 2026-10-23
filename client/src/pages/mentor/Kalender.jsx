import * as React from "react";
import { AccountHeader } from "@/components/ui";
import { useAuth } from "@/auth/auth";
import { api } from "@/lib/api";
import { KalenderView } from "./KalenderView";

export default function KalenderPage() {
  const { user } = useAuth();
  const [slots, setSlots] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const loadSlots = React.useCallback(async () => {
    try {
      const from = new Date();
      const to = new Date(from.getTime() + 30 * 24 * 60 * 60 * 1000);
      const res = await api.get(
        `/mentor/slots?from=${encodeURIComponent(from.toISOString())}&to=${encodeURIComponent(to.toISOString())}`
      );
      setSlots(res?.slots || []);
    } catch (err) {
      console.error("Failed to load slots:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  return (
    <>
      <AccountHeader
        title="Kelola Kalender"
        subtitle="Atur slot yang dapat langsung dibooking mahasiswa."
        userName={user?.fullName || "Mentor"}
        userRole="Mentor"
        avatarUrl={user?.avatarUrl ?? "/avatar-default.svg"}
      />
      {loading ? (
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-center px-8 py-20 text-xs text-neutral-400">
          Memuat kalender…
        </div>
      ) : (
        <KalenderView slots={slots} onReload={loadSlots} />
      )}
    </>
  );
}
