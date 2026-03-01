"use client";

import { ArrowUpFromLine, LoaderCircle } from "lucide-react";
import Image from "next/image";
import type { DragEvent, RefObject } from "react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { CloudinaryUploadedAsset } from "@/lib/cloudinary-upload";
import { describeCreateListingImage } from "@/lib/create-listing";
import { cn } from "@/lib/utils";

import type { PreviewState } from "./use-create-listing-workspace";

type CreateListingImageDropzoneProps = {
  inputRef: RefObject<HTMLInputElement | null>;
  isDragging: boolean;
  onDragLeave: () => void;
  onDragOver: (event: DragEvent<HTMLButtonElement>) => void;
  onDrop: (event: DragEvent<HTMLButtonElement>) => void;
  onFileChange: (file: File | null) => void;
  onOpenFilePicker: () => void;
  preview: PreviewState | null;
  showUploadOverlay: boolean;
  uploadedAsset: CloudinaryUploadedAsset | null;
  uploadProgress: number;
  uploadState: "processing" | "uploading";
};

export function CreateListingImageDropzone({
  inputRef,
  isDragging,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileChange,
  onOpenFilePicker,
  preview,
  showUploadOverlay,
  uploadedAsset,
  uploadProgress,
  uploadState,
}: CreateListingImageDropzoneProps) {
  return (
    <>
      <input
        ref={inputRef}
        hidden
        accept="image/*"
        type="file"
        onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
      />

      <button
        className={cn(
          "group relative flex min-h-[20rem] flex-1 flex-col justify-center overflow-hidden rounded-[1.75rem] border transition duration-200 lg:min-h-0",
          preview || uploadedAsset
            ? "border-border/70 bg-background/65"
            : isDragging
              ? "border-primary/70 border-dashed bg-primary/12 shadow-[0_0_0_1px_rgba(252,211,77,0.25),0_20px_60px_rgba(0,0,0,0.2)]"
              : "border-border/70 border-dashed bg-background/45 hover:border-primary/45 hover:bg-background/65",
        )}
        type="button"
        onClick={onOpenFilePicker}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        {uploadedAsset ? (
          <>
            <Image
              alt="Uploaded listing preview"
              className="h-full w-full object-cover"
              fill
              src={uploadedAsset.secureUrl}
            />
            <div className="absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-3 bg-gradient-to-b from-black/70 via-black/20 to-transparent p-4">
              <Badge className="max-w-full truncate rounded-full bg-black/55 px-3 py-1 text-xs text-white backdrop-blur-sm">
                Cloudinary hosted image
              </Badge>
              <Badge className="rounded-full bg-emerald-600/85 px-3 py-1 text-xs text-white backdrop-blur-sm">
                {describeCreateListingImage({
                  size: uploadedAsset.bytes,
                  type: "image/uploaded",
                })}
              </Badge>
            </div>
          </>
        ) : preview ? (
          <>
            <Image
              alt={preview.file.name}
              className="h-full w-full object-cover"
              fill
              unoptimized
              src={preview.url}
            />
            <div className="absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-3 bg-gradient-to-b from-black/70 via-black/20 to-transparent p-4">
              <Badge className="max-w-full truncate rounded-full bg-black/55 px-3 py-1 text-xs text-white backdrop-blur-sm">
                {preview.file.name}
              </Badge>
              <Badge className="rounded-full bg-black/55 px-3 py-1 text-xs text-white backdrop-blur-sm">
                {describeCreateListingImage(preview.file)}
              </Badge>
            </div>
            {showUploadOverlay ? (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent p-4">
                <div className="rounded-[1.25rem] border border-white/15 bg-black/55 p-4 text-left backdrop-blur-md">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-primary-foreground/75">
                        {uploadState === "uploading"
                          ? "Uploading"
                          : "Processing"}
                      </p>
                      <p className="mt-1 text-sm font-medium text-white">
                        {uploadState === "uploading"
                          ? "Streaming the image to Cloudinary with signed upload credentials."
                          : "Processing the hosted image before the final state resolves."}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <LoaderCircle className="size-4 animate-spin" />
                      <span className="text-sm font-semibold">
                        {uploadState === "uploading"
                          ? `${uploadProgress}%`
                          : "100%"}
                      </span>
                    </div>
                  </div>
                  <Progress
                    className="mt-4 h-2.5 bg-white/20"
                    value={uploadProgress}
                  />
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-8 text-center md:py-10">
            <div className="flex size-[4.5rem] items-center justify-center rounded-[1.5rem] border border-primary/25 bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-105">
              <ArrowUpFromLine className="size-8" />
            </div>
            <div className="mt-6 space-y-3">
              <p className="text-sm uppercase tracking-[0.22em] text-primary">
                Step 1
              </p>
              <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
                Drag a listing image here
              </h2>
              <p className="mx-auto max-w-xl text-sm text-muted-foreground md:text-base">
                Drop a photo anywhere in this panel or click to open your file
                picker. Upload starts only after you confirm the local preview.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className={buttonVariants({ size: "lg" })}>
                Choose image
              </span>
              <span className="rounded-full border border-border/70 bg-card/70 px-4 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                JPEG, PNG, WebP, AVIF
              </span>
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Single image only. Signed Cloudinary upload begins after you click
              Upload.
            </p>
          </div>
        )}
      </button>
    </>
  );
}
