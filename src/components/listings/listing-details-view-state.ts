import { getInitialListingImageIndex } from "@/lib/listings";

export type ListingDetailsImage = {
  id: string;
  isMain: boolean;
  url: string;
};

export type ListingDetailsState = {
  actionError: string | null;
  deletingImageId: string | null;
  images: ListingDetailsImage[];
  isDragging: boolean;
  isUploading: boolean;
  selectedImageIndex: number;
  settingMainImageId: string | null;
  uploadError: string | null;
  uploadProgress: number;
};

export type ListingDetailsAction =
  | { type: "drag/start" }
  | { type: "drag/end" }
  | { type: "selected-image/set"; index: number }
  | { type: "upload/start" }
  | { type: "upload/progress"; progress: number }
  | { type: "upload/processing" }
  | { type: "upload/success"; image: ListingDetailsImage }
  | { type: "upload/error"; message: string }
  | { type: "delete/start"; imageId: string }
  | { type: "delete/success"; imageId: string }
  | { type: "delete/error"; message: string }
  | { type: "set-main/start"; imageId: string }
  | { type: "set-main/success"; imageId: string }
  | { type: "set-main/error"; message: string };

export const clampSelectedImageIndex = (
  imageCount: number,
  selectedIndex: number,
) => {
  if (imageCount <= 0) {
    return 0;
  }

  return Math.min(selectedIndex, imageCount - 1);
};

export const createInitialListingDetailsState = (
  images: ListingDetailsImage[],
): ListingDetailsState => ({
  actionError: null,
  deletingImageId: null,
  images,
  isDragging: false,
  isUploading: false,
  selectedImageIndex: getInitialListingImageIndex(images, 5),
  settingMainImageId: null,
  uploadError: null,
  uploadProgress: 0,
});

export const listingDetailsReducer = (
  state: ListingDetailsState,
  action: ListingDetailsAction,
): ListingDetailsState => {
  switch (action.type) {
    case "drag/start":
      return {
        ...state,
        isDragging: true,
      };
    case "drag/end":
      return {
        ...state,
        isDragging: false,
      };
    case "selected-image/set":
      return {
        ...state,
        selectedImageIndex: clampSelectedImageIndex(
          state.images.length,
          action.index,
        ),
      };
    case "upload/start":
      return {
        ...state,
        actionError: null,
        isUploading: true,
        uploadError: null,
        uploadProgress: 0,
      };
    case "upload/progress":
      return {
        ...state,
        uploadProgress: action.progress,
      };
    case "upload/processing":
      return {
        ...state,
        uploadProgress: 100,
      };
    case "upload/success":
      return {
        ...state,
        images: [...state.images, action.image],
        isDragging: false,
        isUploading: false,
        uploadError: null,
        uploadProgress: 0,
      };
    case "upload/error":
      return {
        ...state,
        isDragging: false,
        isUploading: false,
        uploadError: action.message,
        uploadProgress: 0,
      };
    case "delete/start":
      return {
        ...state,
        actionError: null,
        deletingImageId: action.imageId,
      };
    case "delete/success": {
      const images = state.images.filter(
        (image) => image.id !== action.imageId,
      );

      return {
        ...state,
        deletingImageId: null,
        images,
        selectedImageIndex: clampSelectedImageIndex(
          images.length,
          state.selectedImageIndex,
        ),
      };
    }
    case "delete/error":
      return {
        ...state,
        actionError: action.message,
        deletingImageId: null,
      };
    case "set-main/start":
      return {
        ...state,
        actionError: null,
        settingMainImageId: action.imageId,
      };
    case "set-main/success":
      return {
        ...state,
        images: state.images.map((image) => ({
          ...image,
          isMain: image.id === action.imageId,
        })),
        settingMainImageId: null,
      };
    case "set-main/error":
      return {
        ...state,
        actionError: action.message,
        settingMainImageId: null,
      };
    default:
      return state;
  }
};

const imageLimit = 5;

export const hasReachedListingImageLimit = (imageCount: number) =>
  imageCount >= imageLimit;
