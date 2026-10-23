import { Mail, Check } from "lucide-react";
import { HeaderLegal, Eyebrow } from "@/components/ui";

const SUMMARY_CARDS = [
    {
        title: "Platform penghubung",
        body: "Tutorin menghubungkan mahasiswa dengan peer tutor, bukan institusi pendidikan.",
    },
    {
        title: "Booking & pembayaran aman",
        body: "Dana ditahan sistem dan diteruskan ke mentor setelah sesi berakhir.",
    },
    {
        title: "Gunakan dengan hormat",
        body: "Dilarang kecurangan akademik, pelecehan, atau aktivitas melanggar hukum.",
    },
];
const SECTIONS = [
    {
        id: "layanan",
        title: "Tentang layanan",
        body: "Tutorin menyediakan platform yang membantu mahasiswa menemukan peer tutor, memilih jadwal, melakukan booking, dan menyelesaikan pembayaran. Tutorin bukan institusi pendidikan dan tidak menjamin hasil akademik tertentu.",
        points: [
            "Tutorin berperan sebagai perantara, bukan penyelenggara pendidikan.",
            "Hasil belajar bergantung pada mahasiswa dan mentor masing-masing.",
        ],
    },
    {
        id: "akun",
        title: "Akun dan tanggung jawab",
        body: "Pengguna bertanggung jawab atas kebenaran informasi akun serta seluruh aktivitas yang terjadi melalui akun tersebut. Pengguna harus menjaga password dan segera melaporkan akses yang tidak dikenal.",
    },
    {
        id: "booking",
        title: "Booking dan pembatalan",
        body: "Booking dianggap terkonfirmasi setelah pembayaran berhasil. Perubahan jadwal, pembatalan, keterlambatan, atau ketidakhadiran mengikuti kebijakan yang ditampilkan sebelum pengguna menyelesaikan booking.",
        points: [
            "Konfirmasi terjadi setelah pembayaran berhasil.",
            "Kebijakan pembatalan ditampilkan sebelum booking diselesaikan.",
        ],
    },
    {
        id: "pembayaran",
        title: "Pembayaran dan escrow",
        body: "Pembayaran diproses melalui metode yang tersedia di platform. Dana dapat ditahan sementara oleh sistem dan diteruskan kepada mentor secara otomatis setelah jadwal sesi berakhir.",
    },
    {
        id: "perilaku",
        title: "Perilaku pengguna",
        body: "Pengguna wajib berkomunikasi dengan hormat dan dilarang menggunakan Tutorin untuk tindakan melanggar hukum, kecurangan akademik, pelecehan, atau penyebaran materi tanpa izin.",
    },
    {
        id: "perubahan",
        title: "Perubahan dan kontak",
        body: "Tutorin dapat memperbarui syarat ini untuk menyesuaikan layanan atau ketentuan hukum. Perubahan penting akan diinformasikan melalui kanal yang wajar.",
    },
];
export default function SyaratKetentuanPage() {
    return (<>
      <HeaderLegal pageLabel="Syarat & Ketentuan"/>

      {/* Hero */}
      <section className="flex flex-col items-center gap-4 px-40 pb-11 pt-14 text-center">
        <Eyebrow>Dokumen legal Tutorin</Eyebrow>
        <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-neutral-900 lg:text-5xl">
          Syarat &amp; Ketentuan
        </h1>
        <p className="max-w-prose text-base leading-relaxed text-neutral-600">
          Aturan dasar penggunaan Tutorin bagi mahasiswa, mentor, dan pengunjung
          agar pengalaman belajar tetap aman dan jelas.
        </p>
        <div className="flex items-center gap-3 font-mono text-[11px] text-neutral-500">
          <span>Terakhir diperbarui: 1 Okt 2026</span>
          <span className="h-3 w-px bg-neutral-300"/>
          <span>Estimasi baca 6 menit</span>
        </div>
      </section>



      {/* Important summary */}
      <section className="flex flex-col gap-5 bg-surface px-40 pb-10 pt-9">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Ringkasan poin penting
          </h2>
          <p className="text-sm text-neutral-500">
            Ringkasan ini membantu memahami dokumen, tetapi tidak menggantikan
            isi lengkap.
          </p>
        </div>
        <div className="flex gap-4">
          {SUMMARY_CARDS.map((card) => (<div key={card.title} className="flex flex-1 flex-col gap-3 rounded-xl border border-neutral-200/80 bg-white p-5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Check size={18} strokeWidth={1.75} aria-hidden="true"/>
              </span>
              <h3 className="text-sm font-semibold text-neutral-900">{card.title}</h3>
              <p className="text-sm text-neutral-500">{card.body}</p>
            </div>))}
        </div>
      </section>

      {/* Legal content */}
      <section className="flex gap-14 px-40 pb-16 pt-14">
        {/* Table of contents */}
        <nav className="sticky top-6 flex h-fit w-[260px] shrink-0 flex-col gap-3 rounded-xl border border-neutral-200/80 bg-white p-5" aria-label="Daftar isi">
          <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">Daftar isi</span>
          <ol className="flex flex-col gap-1">
            {SECTIONS.map((section, i) => (<li key={section.id}>
                <a href={`#${section.id}`} className="flex items-start gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-brand-700">
                  <span className="font-mono text-xs text-brand-700">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {section.title}
                </a>
              </li>))}
          </ol>
        </nav>

        {/* Document body */}
        <div className="flex flex-1 flex-col gap-6">
          {SECTIONS.map((section, i) => (<article key={section.id} id={section.id} className="flex scroll-mt-6 flex-col gap-3 border-b border-neutral-100 pb-6 last:border-b-0">
              <div className="flex items-center gap-3">
                <span className="flex size-7 items-center justify-center rounded-md bg-brand-50 font-mono text-[11px] font-semibold text-brand-700">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
                  {section.title}
                </h2>
              </div>
              <p className="max-w-prose text-sm leading-relaxed text-neutral-600">
                {section.body}
              </p>
              {section.points && (<ul className="flex flex-col gap-2">
                  {section.points.map((point) => (<li key={point} className="flex items-start gap-2 text-sm text-neutral-700">
                      <Check size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-brand-600" aria-hidden="true"/>
                      {point}
                    </li>))}
                </ul>)}
            </article>))}

          {/* Contact box */}
          <div className="flex items-center gap-3 rounded-xl border border-brand-100 bg-brand-50 p-5">
            <Mail size={20} strokeWidth={1.75} className="shrink-0 text-brand-700" aria-hidden="true"/>
            <p className="flex-1 text-sm text-neutral-700">
              Punya pertanyaan tentang syarat penggunaan atau membutuhkan
              klarifikasi? Hubungi tim legal Tutorin.
            </p>
            <a href="mailto:legal@tutorin.id" className="font-mono text-[13px] font-medium text-brand-700 hover:underline">
              legal@tutorin.id
            </a>
          </div>
        </div>
      </section>
    </>);
}
