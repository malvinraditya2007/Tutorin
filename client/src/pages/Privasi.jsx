import { Mail, Check } from "lucide-react";
import { HeaderLegal, Eyebrow } from "@/components/ui";

const SUMMARY_CARDS = [
    {
        title: "Data yang dikumpulkan",
        body: "Data akun, aktivitas booking, transaksi, perangkat, dan komunikasi bantuan.",
    },
    {
        title: "Digunakan seperlunya",
        body: "Untuk menyediakan layanan, menjaga keamanan, dan meningkatkan pengalaman.",
    },
    {
        title: "Kamu punya kendali",
        body: "Akses, perbaiki, unduh, atau ajukan penghapusan data sesuai ketentuan.",
    },
];
const SECTIONS = [
    {
        id: "data-dikumpulkan",
        title: "Data yang kami kumpulkan",
        body: "Kami dapat mengumpulkan informasi yang diberikan saat membuat akun, memperbarui profil, melakukan booking, menjadi mentor, menghubungi bantuan, atau menggunakan fitur Tutorin.",
        points: [
            "Nama, email, universitas, program studi, dan informasi profil.",
            "Detail booking, pembayaran, ulasan, dan riwayat bantuan.",
            "Informasi perangkat, log aktivitas, dan preferensi penggunaan.",
        ],
    },
    {
        id: "penggunaan-data",
        title: "Cara kami menggunakan data",
        body: "Data digunakan untuk menjalankan layanan, memproses booking dan pembayaran, menampilkan profil yang relevan, menjaga keamanan, mengirim pemberitahuan penting, dan memahami cara layanan digunakan.",
    },
    {
        id: "berbagi-data",
        title: "Berbagi dan penyedia layanan",
        body: "Kami dapat membagikan data terbatas kepada penyedia pembayaran, komunikasi, hosting, analitik, atau pihak lain yang membantu operasional. Mereka hanya menerima data yang diperlukan untuk menjalankan tugasnya.",
    },
    {
        id: "keamanan",
        title: "Penyimpanan dan keamanan",
        body: "Kami menerapkan langkah teknis dan organisasi yang wajar untuk melindungi data. Data disimpan selama diperlukan untuk menyediakan layanan, memenuhi kewajiban hukum, menyelesaikan sengketa, dan menjaga keamanan.",
        points: [
            "Akses dibatasi berdasarkan kebutuhan kerja.",
            "Transmisi dan kredensial dilindungi dengan kontrol keamanan yang sesuai.",
        ],
    },
    {
        id: "hak-pengguna",
        title: "Hak pengguna",
        body: "Pengguna dapat meminta akses, koreksi, salinan, pembatasan, atau penghapusan data pribadi sesuai hukum yang berlaku. Beberapa data mungkin tetap disimpan apabila diperlukan untuk kewajiban hukum atau keamanan.",
    },
    {
        id: "cookie-kontak",
        title: "Cookie, perubahan, dan kontak",
        body: "Tutorin dapat menggunakan cookie untuk fungsi dasar, preferensi, dan analitik. Kebijakan ini dapat diperbarui dan perubahan penting akan diinformasikan melalui kanal yang wajar.",
    },
];
export default function KebijakanPrivasiPage() {
    return (<>
      <HeaderLegal pageLabel="Kebijakan Privasi"/>

      {/* Hero */}
      <section className="flex flex-col items-center gap-4 px-40 pb-11 pt-14 text-center">
        <Eyebrow>Dokumen legal Tutorin</Eyebrow>
        <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-neutral-900 lg:text-5xl">
          Kebijakan Privasi
        </h1>
        <p className="max-w-prose text-base leading-relaxed text-neutral-600">
          Penjelasan ringkas tentang data yang dikumpulkan Tutorin, cara data
          digunakan dan dilindungi, serta pilihan yang tersedia untukmu.
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
      <section className="flex gap-[54px] px-40 pb-16 pt-[54px]">
        {/* Table of contents */}
        <nav className="sticky top-6 flex h-fit w-[260px] shrink-0 flex-col gap-3 rounded-xl border border-neutral-200/80 bg-white p-5" aria-label="Daftar isi">
          <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">Daftar isi</span>
          <ol className="flex flex-col gap-2.5">
            {SECTIONS.map((section, i) => (<li key={section.id}>
                <a href={`#${section.id}`} className="flex items-start gap-2.5 text-[13px] text-neutral-600 transition-colors hover:text-brand-700">
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
              Untuk pertanyaan privasi atau permintaan terkait hak data, hubungi
              tim privasi Tutorin.
            </p>
            <a href="mailto:legal@tutorin.id" className="font-mono text-[13px] font-medium text-brand-700 hover:underline">
              legal@tutorin.id
            </a>
          </div>
        </div>
      </section>
    </>);
}
