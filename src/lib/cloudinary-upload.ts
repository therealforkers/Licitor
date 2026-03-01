"use client";

export type CloudinaryUploadedAsset = {
  bytes: number;
  publicId: string;
  secureUrl: string;
};

type UploadSignatureResponse = {
  apiKey: string;
  cloudName: string;
  folder: string;
  signature: string;
  timestamp: number;
  uploadPreset: string;
};

const getErrorMessage = async (response: Response) => {
  try {
    const payload = (await response.json()) as { error?: string };
    return payload.error ?? `Request failed with status ${response.status}.`;
  } catch {
    return `Request failed with status ${response.status}.`;
  }
};

const fetchUploadSignature = async () => {
  const response = await fetch("/api/cloudinary/signature", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as UploadSignatureResponse;
};

export const uploadImageToCloudinary = async (
  file: File,
  options: {
    onProgress?: (progress: number) => void;
    onRequestChange?: (request: XMLHttpRequest | null) => void;
  } = {},
) => {
  const signature = await fetchUploadSignature();

  return new Promise<CloudinaryUploadedAsset>((resolve, reject) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("api_key", signature.apiKey);
    formData.append("folder", signature.folder);
    formData.append("signature", signature.signature);
    formData.append("timestamp", `${signature.timestamp}`);
    formData.append("upload_preset", signature.uploadPreset);

    const request = new XMLHttpRequest();
    options.onRequestChange?.(request);

    request.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
    );

    request.upload.addEventListener("progress", (event) => {
      if (!event.lengthComputable) {
        return;
      }

      options.onProgress?.(
        Math.min(99, Math.round((event.loaded / event.total) * 100)),
      );
    });

    request.addEventListener("load", () => {
      options.onRequestChange?.(null);

      if (request.status < 200 || request.status >= 300) {
        reject(new Error("Cloudinary upload failed."));
        return;
      }

      try {
        const payload = JSON.parse(request.responseText) as {
          bytes?: number;
          public_id?: string;
          secure_url?: string;
        };

        if (!payload.public_id || !payload.secure_url) {
          reject(new Error("Cloudinary response was missing upload data."));
          return;
        }

        resolve({
          bytes: payload.bytes ?? file.size,
          publicId: payload.public_id,
          secureUrl: payload.secure_url,
        });
      } catch {
        reject(new Error("Cloudinary returned an unreadable response."));
      }
    });

    request.addEventListener("error", () => {
      options.onRequestChange?.(null);
      reject(new Error("Cloudinary upload failed."));
    });

    request.addEventListener("abort", () => {
      options.onRequestChange?.(null);
      reject(new Error("Cloudinary upload was cancelled."));
    });

    request.send(formData);
  });
};

export const deleteCloudinaryImage = async (publicId: string) => {
  const response = await fetch("/api/cloudinary/asset", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      publicId,
    }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
};
