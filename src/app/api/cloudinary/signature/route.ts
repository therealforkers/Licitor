import { NextResponse } from "next/server";

import { requireCurrentUserSession } from "@/lib/auth-session";
import { createSignedUploadParams } from "@/lib/cloudinary";

export async function POST() {
  await requireCurrentUserSession();

  return NextResponse.json(createSignedUploadParams());
}
