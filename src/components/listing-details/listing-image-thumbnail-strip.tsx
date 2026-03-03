"use client";

import { LoaderCircle, Star, Trash2 } from "lucide-react";
import Image from "next/image";

import { useListingDetailsContext } from "@/components/listing-details/listing-details-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ListingImageThumbnailStrip() {
  const {
    canManageGalleryImages,
    canSetMainImage,
    deleteImage,
    deletingImageId,
    isMutatingImage,
    isOwner,
    listing,
    selectedImageIndex,
    setMainImage,
    setSelectedImage,
    settingMainImageId,
    visibleImages,
  } = useListingDetailsContext();

  if (visibleImages.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-5 border-y-2 border-border/70">
      {visibleImages.map((image, index) => {
        const isSelected = index === selectedImageIndex;
        const isMain = image.isMain;

        return (
          <div
            key={image.id}
            className={cn(
              "group relative aspect-square overflow-hidden border-r-2 border-border/70 bg-background/60",
              index === visibleImages.length - 1 && "border-r-0",
              isSelected && "shadow-[inset_0_0_0_1px_var(--color-primary)]",
            )}
          >
            <button
              type="button"
              className="absolute inset-0 cursor-pointer"
              data-testid={`listing-thumbnail-${index + 1}`}
              onClick={() => setSelectedImage(index)}
            >
              <Image
                alt={`${listing.title} thumbnail ${index + 1}`}
                className="object-cover transition duration-300 group-hover:scale-[1.03]"
                fill
                sizes="20vw"
                src={image.url}
              />
              <span className="sr-only">
                View image {index + 1} for {listing.title}
              </span>
            </button>

            {isOwner ? (
              <div className="absolute inset-x-2 top-2 flex items-center justify-between gap-2">
                <Button
                  type="button"
                  size="icon-xs"
                  variant="secondary"
                  className={cn(
                    "bg-black/65 text-white hover:bg-black/80",
                    isMain &&
                      "bg-amber-400/90 text-black hover:bg-amber-300/90",
                  )}
                  aria-pressed={isMain}
                  disabled={!canSetMainImage || isMutatingImage || isMain}
                  onClick={() => {
                    if (!isMain) {
                      setSelectedImage(index);
                      void setMainImage(image.id);
                    }
                  }}
                >
                  {settingMainImageId === image.id ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <Star className={cn(isMain && "fill-current")} />
                  )}
                  <span className="sr-only">
                    {isMain ? "Main image selected" : "Set as main image"}
                  </span>
                </Button>

                {!isMain && canManageGalleryImages ? (
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="destructive"
                    disabled={isMutatingImage}
                    onClick={() => {
                      void deleteImage(image.id);
                    }}
                  >
                    {deletingImageId === image.id ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      <Trash2 />
                    )}
                    <span className="sr-only">Delete image</span>
                  </Button>
                ) : (
                  <span />
                )}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
