import { NextResponse } from "next/server";
import { z } from "zod";

import { requireCurrentUserSession } from "@/lib/auth-session";
import { deleteCloudinaryImage } from "@/lib/cloudinary";

const deleteAssetSchema = z.object({
  publicId: z.string().min(1, "Public id is required."),
});

export async function DELETE(request: Request) {
  await requireCurrentUserSession();

  const body = await request.json();
  const parsed = deleteAssetSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message ?? "Invalid Cloudinary payload.",
      },
      { status: 400 },
    );
  }

  await deleteCloudinaryImage(parsed.data.publicId);

  return NextResponse.json({ success: true });
}
