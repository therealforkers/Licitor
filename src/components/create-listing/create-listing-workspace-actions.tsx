"use client";

import {
  ArrowUpFromLine,
  LoaderCircle,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type CreateListingWorkspaceActionsProps = {
  canUpload: boolean;
  errorMessage: string | null;
  hasUploadedAsset: boolean;
  isContinuing: boolean;
  isProcessingUpload: boolean;
  isResetting: boolean;
  isUploading: boolean;
  onClearPreview: () => void;
  onContinue: () => void;
  onReset: () => void;
  onUpload: () => void;
};

export function CreateListingWorkspaceActions({
  canUpload,
  errorMessage,
  hasUploadedAsset,
  isContinuing,
  isProcessingUpload,
  isResetting,
  isUploading,
  onClearPreview,
  onContinue,
  onReset,
  onUpload,
}: CreateListingWorkspaceActionsProps) {
  return (
    <div className="flex shrink-0 flex-col gap-3">
      <div className="flex justify-end gap-3">
        {hasUploadedAsset ? (
          <>
            <Button
              disabled={isContinuing || isResetting}
              size="lg"
              type="button"
              onClick={onContinue}
            >
              {isContinuing ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              Continue
            </Button>
            <Button
              disabled={isContinuing || isResetting}
              size="lg"
              type="button"
              variant="outline"
              onClick={onReset}
            >
              {isResetting ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <RotateCcw className="size-4" />
              )}
              Reset
            </Button>
          </>
        ) : (
          <>
            <Button
              disabled={!canUpload}
              size="lg"
              type="button"
              onClick={onUpload}
            >
              {isUploading || isProcessingUpload ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <ArrowUpFromLine className="size-4" />
              )}
              Upload
            </Button>
            <Button
              disabled={!canUpload}
              size="lg"
              type="button"
              variant="outline"
              onClick={onClearPreview}
            >
              <X className="size-4" />
              Cancel
            </Button>
          </>
        )}
      </div>

      {errorMessage ? (
        <p className="text-sm text-destructive">{errorMessage}</p>
      ) : null}
    </div>
  );
}
