"use client";

import { useRouter } from "next/navigation";
import { useEffect, useReducer, useRef } from "react";

import {
  type CloudinaryUploadedAsset,
  deleteCloudinaryImage,
  uploadImageToCloudinary,
} from "@/lib/cloudinary-upload";
import { isCreateListingImageFile } from "@/lib/create-listing";
import { createDraftListingAction } from "@/server/actions/listings";

export type PreviewState = {
  file: File;
  url: string;
};

type WorkspacePhase =
  | "idle"
  | "preview"
  | "uploading"
  | "processing"
  | "uploaded";

type WorkspaceState = {
  errorMessage: string | null;
  isContinuing: boolean;
  isDragging: boolean;
  isResetting: boolean;
  phase: WorkspacePhase;
  preview: PreviewState | null;
  uploadedAsset: CloudinaryUploadedAsset | null;
  uploadProgress: number;
};

type WorkspaceAction =
  | { type: "drag/start" }
  | { type: "drag/end" }
  | { type: "preview/set"; preview: PreviewState }
  | { type: "preview/clear" }
  | { type: "upload/start" }
  | { type: "upload/progress"; progress: number }
  | { type: "upload/processing"; progress: number }
  | { type: "upload/success"; asset: CloudinaryUploadedAsset }
  | { type: "upload/error"; errorMessage: string }
  | { type: "reset/start" }
  | { type: "reset/success" }
  | { type: "reset/error"; errorMessage: string }
  | { type: "continue/start" }
  | { type: "continue/error"; errorMessage: string }
  | { type: "error/set"; errorMessage: string | null };

const initialState: WorkspaceState = {
  errorMessage: null,
  isContinuing: false,
  isDragging: false,
  isResetting: false,
  phase: "idle",
  preview: null,
  uploadedAsset: null,
  uploadProgress: 0,
};

const reducer = (
  state: WorkspaceState,
  action: WorkspaceAction,
): WorkspaceState => {
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
    case "preview/set":
      return {
        ...state,
        errorMessage: null,
        isDragging: false,
        isResetting: false,
        phase: "preview",
        preview: action.preview,
        uploadedAsset: null,
        uploadProgress: 0,
      };
    case "preview/clear":
      return {
        ...state,
        errorMessage: null,
        isDragging: false,
        phase: "idle",
        preview: null,
        uploadProgress: 0,
      };
    case "upload/start":
      return {
        ...state,
        errorMessage: null,
        phase: "uploading",
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
        phase: "processing",
        uploadProgress: action.progress,
      };
    case "upload/success":
      return {
        ...state,
        errorMessage: null,
        phase: "uploaded",
        preview: null,
        uploadedAsset: action.asset,
        uploadProgress: 0,
      };
    case "upload/error":
      return {
        ...state,
        errorMessage: action.errorMessage,
        phase: state.preview ? "preview" : "idle",
        uploadProgress: 0,
      };
    case "reset/start":
      return {
        ...state,
        errorMessage: null,
        isResetting: true,
      };
    case "reset/success":
      return {
        ...initialState,
      };
    case "reset/error":
      return {
        ...state,
        errorMessage: action.errorMessage,
        isResetting: false,
      };
    case "continue/start":
      return {
        ...state,
        errorMessage: null,
        isContinuing: true,
      };
    case "continue/error":
      return {
        ...state,
        errorMessage: action.errorMessage,
        isContinuing: false,
      };
    case "error/set":
      return {
        ...state,
        errorMessage: action.errorMessage,
      };
    default:
      return state;
  }
};

const revokePreviewUrl = (preview: PreviewState | null) => {
  if (preview) {
    URL.revokeObjectURL(preview.url);
  }
};

export const useCreateListingWorkspace = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadRequestRef = useRef<XMLHttpRequest | null>(null);
  const previewRef = useRef<PreviewState | null>(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    previewRef.current = state.preview;
  }, [state.preview]);

  useEffect(() => {
    return () => {
      revokePreviewUrl(previewRef.current);
      uploadRequestRef.current?.abort();
    };
  }, []);

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const canReplacePreview = state.phase === "idle" || state.phase === "preview";
  const canOpenFilePicker = state.phase === "idle";
  const canUpload = state.phase === "preview";
  const canReset =
    state.phase === "uploaded" && !state.isResetting && !state.isContinuing;
  const canContinue =
    state.phase === "uploaded" && !state.isResetting && !state.isContinuing;
  const showUploadOverlay =
    Boolean(state.preview) &&
    (state.phase === "uploading" || state.phase === "processing");

  const openFilePicker = () => {
    if (!canOpenFilePicker || state.uploadedAsset) {
      return;
    }

    fileInputRef.current?.click();
  };

  const setNextPreview = (file: File | null) => {
    if (!file) {
      return;
    }

    if (!isCreateListingImageFile(file)) {
      dispatch({
        type: "error/set",
        errorMessage: "Choose a valid image file to preview this listing.",
      });
      return;
    }

    revokePreviewUrl(previewRef.current);

    const nextPreview = {
      file,
      url: URL.createObjectURL(file),
    };

    previewRef.current = nextPreview;
    resetFileInput();
    dispatch({
      type: "preview/set",
      preview: nextPreview,
    });
  };

  const clearPreview = () => {
    revokePreviewUrl(previewRef.current);
    previewRef.current = null;
    uploadRequestRef.current?.abort();
    resetFileInput();
    dispatch({ type: "preview/clear" });
  };

  const startDragging = () => {
    if (canReplacePreview && !state.uploadedAsset) {
      dispatch({ type: "drag/start" });
    }
  };

  const stopDragging = () => {
    dispatch({ type: "drag/end" });
  };

  const uploadPreview = async () => {
    const preview = previewRef.current;

    if (!preview || !canUpload) {
      return;
    }

    dispatch({ type: "upload/start" });

    try {
      const uploadedAsset = await uploadImageToCloudinary(preview.file, {
        onProgress: (progress) => {
          dispatch({ type: "upload/progress", progress });
        },
        onRequestChange: (request) => {
          uploadRequestRef.current = request;
        },
      });

      dispatch({ type: "upload/processing", progress: 100 });
      await new Promise((resolve) => window.setTimeout(resolve, 450));

      revokePreviewUrl(previewRef.current);
      previewRef.current = null;
      resetFileInput();
      dispatch({ type: "upload/success", asset: uploadedAsset });
    } catch (error) {
      dispatch({
        type: "upload/error",
        errorMessage:
          error instanceof Error
            ? error.message
            : "Upload failed unexpectedly.",
      });
    }
  };

  const resetUploadedAsset = async () => {
    if (!state.uploadedAsset || !canReset) {
      return;
    }

    dispatch({ type: "reset/start" });

    try {
      await deleteCloudinaryImage(state.uploadedAsset.publicId);
      resetFileInput();
      dispatch({ type: "reset/success" });
    } catch (error) {
      dispatch({
        type: "reset/error",
        errorMessage:
          error instanceof Error
            ? error.message
            : "Reset failed. The uploaded image could not be removed.",
      });
    }
  };

  const continueToDraft = async () => {
    if (!state.uploadedAsset || !canContinue) {
      return;
    }

    dispatch({ type: "continue/start" });

    try {
      const result = await createDraftListingAction({
        imageUrl: state.uploadedAsset.secureUrl,
        publicId: state.uploadedAsset.publicId,
      });

      router.push(`/listings/${result.id}`);
    } catch (error) {
      dispatch({
        type: "continue/error",
        errorMessage:
          error instanceof Error
            ? error.message
            : "Draft creation failed unexpectedly.",
      });
    }
  };

  return {
    ...state,
    canContinue,
    canOpenFilePicker,
    canReplacePreview,
    canReset,
    canUpload,
    clearPreview,
    continueToDraft,
    fileInputRef,
    openFilePicker,
    resetUploadedAsset,
    setNextPreview,
    showUploadOverlay,
    startDragging,
    stopDragging,
    uploadPreview,
  };
};
