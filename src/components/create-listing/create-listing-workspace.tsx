"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useCreateListingWorkspace } from "@/hooks/use-create-listing-workspace";
import { CreateListingImageDropzone } from "./create-listing-image-dropzone";
import { CreateListingStepsCard } from "./create-listing-steps-card";
import { CreateListingWorkspaceActions } from "./create-listing-workspace-actions";

const explainerSteps = [
  {
    description:
      "Drop a single image to anchor the listing and move from local preview into signed upload.",
    title: "Upload a clear photo",
  },
  {
    description:
      "Phase 1F still uses placeholder JSON for the draft body while the AI-generated details arrive later.",
    title: "AI drafts listing details",
  },
  {
    description:
      "Continue inserts the draft listing, attaches the hosted image, and redirects you into the details view.",
    title: "Review and publish",
  },
];

export function CreateListingWorkspace() {
  const {
    canOpenFilePicker,
    canReplacePreview,
    canUpload,
    clearPreview,
    continueToDraft,
    errorMessage,
    fileInputRef,
    isContinuing,
    isDragging,
    isResetting,
    openFilePicker,
    phase,
    preview,
    resetUploadedAsset,
    setNextPreview,
    showUploadOverlay,
    startDragging,
    stopDragging,
    uploadedAsset,
    uploadPreview,
    uploadProgress,
  } = useCreateListingWorkspace();

  const isUploading = phase === "uploading";
  const isProcessingUpload = phase === "processing";

  return (
    <div className="grid h-full min-h-0 w-full gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(17rem,0.85fr)]">
      <Card className="min-h-0 overflow-hidden border-border/70 bg-card/95 py-0 shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
        <CardContent className="flex h-full min-h-0 flex-col gap-3 p-4 md:p-5">
          <div className="flex min-h-0 flex-1 flex-col gap-3">
            <CreateListingImageDropzone
              inputRef={fileInputRef}
              isDragging={isDragging}
              preview={preview}
              showUploadOverlay={showUploadOverlay}
              uploadProgress={uploadProgress}
              uploadedAsset={uploadedAsset}
              uploadState={isUploading ? "uploading" : "processing"}
              onDragLeave={stopDragging}
              onDragOver={(event) => {
                event.preventDefault();
                startDragging();
              }}
              onDrop={(event) => {
                event.preventDefault();
                stopDragging();
                if (canReplacePreview) {
                  setNextPreview(event.dataTransfer.files?.[0] ?? null);
                }
              }}
              onFileChange={setNextPreview}
              onOpenFilePicker={() => {
                if (canOpenFilePicker) {
                  openFilePicker();
                }
              }}
            />

            <CreateListingWorkspaceActions
              canUpload={canUpload}
              errorMessage={errorMessage}
              hasUploadedAsset={Boolean(uploadedAsset)}
              isContinuing={isContinuing}
              isProcessingUpload={isProcessingUpload}
              isResetting={isResetting}
              isUploading={isUploading}
              onClearPreview={clearPreview}
              onContinue={continueToDraft}
              onReset={resetUploadedAsset}
              onUpload={uploadPreview}
            />
          </div>
        </CardContent>
      </Card>

      <CreateListingStepsCard steps={explainerSteps} />
    </div>
  );
}
