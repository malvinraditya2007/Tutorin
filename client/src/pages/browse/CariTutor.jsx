import * as React from "react";
import { useSearchParams } from "react-router-dom";
import Link from "@/lib/link";
import { AccountHeader, TutorCard } from "@/components/ui";
import { useAuth } from "@/auth/auth";
import { api } from "@/lib/api";
import { SearchFilterBar } from "./SearchFilterBar";

export default function CariTutorPage() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [tutors, setTutors] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    const queryString = searchParams.toString();
    api.get(`/tutors${queryString ? `?${queryString}` : ""}`)
      .then((data) => {
        if (active) setTutors(data.tutors || []);
      })
      .catch((err) => {
        console.error("Failed to fetch tutors:", err);
        if (active) setTutors([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [searchParams]);

  return (
    <>
      {user ? (
        <AccountHeader
          title="Cari Tutor"
          subtitle="Pilih kakak tingkat & asdos yang cocok dengan mata kuliahmu."
          userName={user.fullName}
          userRole={user.campus ? `Mahasiswa ${user.campus}` : "Mahasiswa"}
          avatarUrl={user.avatarUrl ?? "/avatar-default.svg"}
        />
      ) : (
        <header className="flex h-[88px] shrink-0 items-center justify-between border-b border-neutral-200/80 bg-surface px-9">
          <div className="flex flex-col gap-0.5">
            <span className="text-xl font-semibold tracking-tight text-neutral-900">
              Cari Tutor
            </span>
            <span className="text-sm text-neutral-500">
              Pilih kakak tingkat & asdos yang cocok dengan mata kuliahmu.
            </span>
          </div>
          <Link
            href="/login"
            className="rounded-xl bg-brand-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-600"
          >
            Masuk akun
          </Link>
        </header>
      )}

      <div className="flex w-full max-w-[1280px] flex-col gap-6 px-9 py-7">
        <SearchFilterBar totalCount={tutors.length} />

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center text-sm font-medium text-neutral-500">
            Mencari tutor...
          </div>
        ) : tutors.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-200/80 bg-white px-6 py-16 text-center">
            <h3 className="text-sm font-bold text-neutral-900">
              Belum ada tutor yang cocok
            </h3>
            <p className="max-w-sm text-xs text-neutral-500">
              Coba pilih mata kuliah lain atau hapus filter pencarianmu.
            </p>
            <Link
              href="/cari-tutor"
              className="mt-1 rounded-xl bg-brand-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-600"
            >
              Reset filter
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {tutors.map((t) => (
              <TutorCard
                key={t.id}
                {...t}
                bookingHref={`/tutor/${t.id}`}
                bookingLabel="Lihat profil"
                verified
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
