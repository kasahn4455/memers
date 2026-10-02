"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  aspect?: "square" | "banner";
}

export default function ImageUpload({
  label,
  value,
  onChange,
  aspect = "square",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File must be under 5MB");
        return;
      }

      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || "Upload failed");
        onChange(data.url);
        toast.success("Image uploaded");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Upload failed";
        toast.error(message);
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"] },
    maxFiles: 1,
  });

  const isBanner = aspect === "banner";
  const sizeClass = isBanner ? "w-full h-40" : "w-36 h-36";

  return (
    <div className={isBanner ? "w-full" : ""}>
      <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">
        {label}
      </label>

      {(value || preview) ? (
        <div
          className={`relative rounded-2xl overflow-hidden border border-white/10 group ${sizeClass}`}
        >
          <img src={value || preview} alt={label || "Token image preview"} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <button
            onClick={() => { onChange(""); setPreview(""); }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 hover:bg-red-500/80 hover:border-red-400/50 transition-all"
            aria-label="Remove image"
          >
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`relative flex flex-col items-center justify-center cursor-pointer rounded-2xl border border-dashed transition-all overflow-hidden
            ${
              isDragActive
                ? "border-solana-purple/80 bg-solana-purple/10"
                : "border-white/10 hover:border-solana-purple/50 bg-white/[0.02] hover:bg-white/[0.04]"
            }
            ${sizeClass}`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-7 h-7 text-solana-purple animate-spin" />
              <span className="text-xs text-white/50">Uploading…</span>
            </div>
          ) : (
            <>
              <div
                className={`p-2.5 rounded-xl mb-2 ${
                  isDragActive
                    ? "bg-solana-purple/20 text-solana-purple"
                    : "bg-white/5 text-white/50"
                } transition-colors`}
              >
                {isBanner ? (
                  <Upload className="w-5 h-5" />
                ) : (
                  <ImageIcon className="w-5 h-5" />
                )}
              </div>
              <span className="text-xs font-medium text-white/70">
                {isDragActive ? "Drop here" : "Click or drop"}
              </span>
              <span className="text-[10px] text-white/35 mt-0.5">
                PNG · JPG · WEBP — max 5MB
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
