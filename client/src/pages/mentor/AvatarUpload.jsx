import * as React from "react";
import { Upload, Trash2 } from "lucide-react";

const DEFAULT_AVATAR = "/avatar-default.svg";
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const TARGET_SIZE_PX = 256;

/**
 * Komponen pilih & pratinjau foto profil mentor.
 * Mengompres gambar secara otomatis di sisi klien (256x256 WebP) agar ringan
 * disimpan dan cepat dimuat di kartu maupun halaman profil tutor.
 */
export function AvatarUpload({ initialAvatarUrl, fullName, onChange }) {
  const [avatarUrl, setAvatarUrl] = React.useState(initialAvatarUrl ?? "");
  const [error, setError] = React.useState(null);
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    if (initialAvatarUrl !== undefined) {
      setAvatarUrl(initialAvatarUrl ?? "");
    }
  }, [initialAvatarUrl]);

  const updateAvatar = (val) => {
    setAvatarUrl(val);
    if (onChange) onChange(val);
  };

  const handleFileChange = (e) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Pilih file gambar (JPG, PNG, atau WebP).");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError("Ukuran gambar maksimal 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = TARGET_SIZE_PX;
        canvas.height = TARGET_SIZE_PX;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          updateAvatar(String(reader.result));
          return;
        }

        // Center-crop square
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;
        ctx.drawImage(
          img,
          sx,
          sy,
          minSide,
          minSide,
          0,
          0,
          TARGET_SIZE_PX,
          TARGET_SIZE_PX
        );

        let compressedDataUrl = canvas.toDataURL("image/webp", 0.8);
        // Fallback ke JPEG jika browser tidak mendukung encoding WebP
        if (!compressedDataUrl.startsWith("data:image/webp")) {
          compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8);
        }
        updateAvatar(compressedDataUrl);
      };
      img.onerror = () => {
        setError("Gagal memuat gambar. Coba file lain.");
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setError(null);
    updateAvatar("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const previewSrc = avatarUrl || DEFAULT_AVATAR;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-neutral-700">Foto profil</span>
      <div className="flex items-center gap-4">
        <img
          src={previewSrc}
          alt={fullName || "Mentor"}
          className="size-16 shrink-0 rounded-full border border-neutral-200 object-cover"
        />
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3.5 text-xs font-semibold text-neutral-800 transition hover:border-neutral-300 hover:bg-neutral-50 active:scale-[0.98]">
              <Upload size={14} strokeWidth={1.75} aria-hidden="true" />
              Unggah gambar
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
            {avatarUrl && (
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-600 transition hover:border-danger-500/40 hover:text-danger-600"
              >
                <Trash2 size={14} strokeWidth={1.75} aria-hidden="true" />
                Hapus
              </button>
            )}
          </div>
          <span className="text-[11px] text-neutral-500">
            JPG, PNG, atau WebP (maks. 5MB). Otomatis dipotong persegi.
          </span>
          {error && (
            <span className="text-xs font-medium text-danger-600">{error}</span>
          )}
        </div>
      </div>
      <input type="hidden" name="avatarUrl" value={avatarUrl} />
    </div>
  );
}
