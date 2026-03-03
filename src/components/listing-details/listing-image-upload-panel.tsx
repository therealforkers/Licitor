"use client";

import { ImagePlus, StarOff, Upload } from "lucide-react";
import type { ChangeEvent } from "react";

import { useListingDetailsContext } from "@/components/listing-details/listing-details-context";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function ListingImageUploadPanel() {
  const {
    actionError,
    canManageGalleryImages,
    fileInputRef,
    isDragging,
    isMutatingImage,
    isUploading,
    maxImagesReached,
    onDragLeave,
    onDragOver,
    onDropFile,
    onFileInputChange,
    openFilePicker,
    uploadError,
    uploadProgress,
    visibleImages,
  } = useListingDetailsContext();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFileInputChange(event.target.files?.[0] ?? null);
  };

  return (
    <>
      <input
        ref={fileInputRef}
        hidden
        accept="image/*"
        type="file"
        onChange={handleInputChange}
      />

      <button
        type="button"
        className={cn(
          "mx-0 min-h-48 w-full rounded-2xl border border-dashed p-6 transition",
          !canManageGalleryImages || maxImagesReached
            ? "border-border/50 bg-muted/20"
            : isDragging
              ? "border-primary/70 bg-primary/10"
              : "border-border/70 bg-background/50",
        )}
        disabled={
          !canManageGalleryImages || maxImagesReached || isMutatingImage
        }
        onClick={openFilePicker}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDropFile}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-foreground">
            <ImagePlus className="size-4" />
            <p className="text-sm font-medium">Drag and drop an image here</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Upload starts immediately after drop or file selection.
          </p>
          <div className="flex items-center justify-between gap-3">
            <Badge variant="outline">{visibleImages.length}/5 images</Badge>
            <span className={buttonVariants({ variant: "outline" })}>
              <Upload />
              Choose image
            </span>
          </div>
        </div>
      </button>

      {isUploading ? (
        <div className="space-y-2 rounded-2xl border border-border/70 bg-background/60 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-foreground">
              Uploading image
            </p>
            <p className="text-sm text-muted-foreground">{uploadProgress}%</p>
          </div>
          <Progress value={uploadProgress} />
        </div>
      ) : null}

      {!canManageGalleryImages ? (
        <div className="flex items-start gap-2 rounded-2xl border border-border/70 bg-background/60 p-3 text-sm text-muted-foreground">
          <StarOff className="mt-0.5 size-4 shrink-0" />
          Uploading and deleting images is only available in draft. Main image
          can be changed in draft, active, or scheduled.
        </div>
      ) : null}

      {maxImagesReached ? (
        <p className="text-sm text-muted-foreground">
          Maximum image limit reached. Remove a non-main image before adding
          another.
        </p>
      ) : null}

      {uploadError ? (
        <p className="text-sm text-destructive">{uploadError}</p>
      ) : null}
      {actionError ? (
        <p className="text-sm text-destructive">{actionError}</p>
      ) : null}
    </>
  );
}
