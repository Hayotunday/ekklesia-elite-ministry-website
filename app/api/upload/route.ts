import { NextResponse } from "next/server";
// @ts-ignore: installed separately, types available after `npm install cloudinary`
import { v2 as cloudinary } from "cloudinary";

// configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    // convert file to buffer for upload
    const buffer = Buffer.from(await file.arrayBuffer());
    const isPdf = file.type === "application/pdf";
    // set target folder dynamically based on file type
    const targetFolder = isPdf ? "documents" : "gallery";
    // set resource type dynamically based on file type
    const resourceType = isPdf ? "raw" : "image";
    // configure upload options dynamically based on file type
    const uploadOptions: any = {
      folder: targetFolder,
      resource_type: resourceType,
    };

    // if it's pdf, construct a unique public_id with the.pdf extension preserved
    if (isPdf) {
      const cleanFileName = file.name
        .replace(/\.[^\.]+$/, "") // remove original extension safely
        .replace(/[^a-zA-Z0-9]/g, "_"); //replace special characters with underscores

      uploadOptions.public_id = `${cleanFileName}_${Date.now()}.pdf`; // append timestamp for uniqueness
    }

    const uploadPromise: Promise<any> = new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error: any, result: any) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      stream.end(buffer);
    });

    const result: any = await uploadPromise;
    return NextResponse.json({
      url: result.url,
      secure_url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    console.error("upload error", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const publicId = body?.publicId || body?.id;
    const resourceType = body?.resourceType || "image";
    if (!publicId) {
      return NextResponse.json({ error: "publicId required" }, { status: 400 });
    }
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("delete cloudinary error", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
