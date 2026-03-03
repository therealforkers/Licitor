"use client";

import { createContext, type ReactNode, useContext } from "react";

import { useListingDetailsView } from "@/hooks/use-listing-details-view";
import type { ListingDetailsDto } from "@/types/listings";

type ListingDetailsContextValue = {
  actionError: string | null;
  canManageGalleryImages: boolean;
  canSelectMainFromPreview: boolean;
  canSetMainImage: boolean;
  deleteImage: (imageId: string) => Promise<void>;
  deletingImageId: string | null;
  endAt: Date | null;
  fileInputRef: ReturnType<typeof useListingDetailsView>["fileInputRef"];
  isDragging: boolean;
  isMutatingImage: boolean;
  isOwner: boolean;
  isUploading: boolean;
  listing: ListingDetailsDto;
  mainImageIndex: number;
  maxImagesReached: boolean;
  onDragLeave: () => void;
  onDragOver: ReturnType<typeof useListingDetailsView>["onDragOver"];
  onDropFile: ReturnType<typeof useListingDetailsView>["onDropFile"];
  onFileInputChange: (file: File | null) => void;
  openFilePicker: () => void;
  selectedImage: ReturnType<typeof useListingDetailsView>["selectedImage"];
  selectedImageIndex: number;
  setMainImage: (imageId: string) => Promise<void>;
  setSelectedImage: (index: number) => void;
  settingMainImageId: string | null;
  startAt: Date | null;
  uploadError: string | null;
  uploadProgress: number;
  visibleImages: ReturnType<typeof useListingDetailsView>["visibleImages"];
};

const ListingDetailsContext = createContext<ListingDetailsContextValue | null>(
  null,
);

type ListingDetailsProviderProps = {
  children: ReactNode;
  isOwner: boolean;
  listing: ListingDetailsDto;
};

export function ListingDetailsProvider({
  children,
  isOwner,
  listing,
}: ListingDetailsProviderProps) {
  const startAt = listing.startAt ? new Date(listing.startAt) : null;
  const endAt = listing.endAt ? new Date(listing.endAt) : null;

  const listingView = useListingDetailsView({
    images: listing.images,
    isOwner,
    listingId: listing.id,
    status: listing.status,
  });

  const mainImageIndex = listingView.visibleImages.findIndex(
    (image) => image.isMain,
  );
  const canSelectMainFromPreview =
    mainImageIndex >= 0 && mainImageIndex !== listingView.selectedImageIndex;

  const value: ListingDetailsContextValue = {
    actionError: listingView.actionError,
    canManageGalleryImages: listingView.canManageGalleryImages,
    canSelectMainFromPreview,
    canSetMainImage: listingView.canSetMainImage,
    deleteImage: listingView.deleteImage,
    deletingImageId: listingView.deletingImageId,
    endAt,
    fileInputRef: listingView.fileInputRef,
    isDragging: listingView.isDragging,
    isMutatingImage: listingView.isMutatingImage,
    isOwner,
    isUploading: listingView.isUploading,
    listing,
    mainImageIndex,
    maxImagesReached: listingView.maxImagesReached,
    onDragLeave: listingView.onDragLeave,
    onDragOver: listingView.onDragOver,
    onDropFile: listingView.onDropFile,
    onFileInputChange: listingView.onFileInputChange,
    openFilePicker: listingView.openFilePicker,
    selectedImage: listingView.selectedImage,
    selectedImageIndex: listingView.selectedImageIndex,
    setMainImage: listingView.setMainImage,
    setSelectedImage: listingView.setSelectedImage,
    settingMainImageId: listingView.settingMainImageId,
    startAt,
    uploadError: listingView.uploadError,
    uploadProgress: listingView.uploadProgress,
    visibleImages: listingView.visibleImages,
  };

  return (
    <ListingDetailsContext.Provider value={value}>
      {children}
    </ListingDetailsContext.Provider>
  );
}

export function useListingDetailsContext() {
  const context = useContext(ListingDetailsContext);

  if (!context) {
    throw new Error(
      "useListingDetailsContext must be used within ListingDetailsProvider.",
    );
  }

  return context;
}
