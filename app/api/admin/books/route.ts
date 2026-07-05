import { NextResponse } from "next/server";
import { requireDbAdmin } from "@/lib/firebase-admin";
import { verifyAuth } from "@/lib/auth";
import admin from "firebase-admin";

const COLLECTION = "books";

/**
 * POST /api/admin/books
 * Adds a new book to Firestore.
 * Body: { name: string, fileUrl: string, publicId?: string }
 */
export async function POST(request: Request) {
  try {
    await verifyAuth(request);
    const body = await request.json();

    if (!body.name || !body.fileUrl) {
      return NextResponse.json(
        { error: "Missing required fields: name and fileUrl" },
        { status: 400 },
      );
    }

    const db = requireDbAdmin();
    const ref = await db.collection(COLLECTION).add({
      name: body.name,
      fileUrl: body.fileUrl,
      publicId: body.publicId || null,
      uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id: ref.id });
  } catch (err) {
    console.error("books POST", err);
    return NextResponse.json(
      { error: "Unauthorized or failed" },
      { status: 401 },
    );
  }
}

/**
 * PATCH /api/admin/books
 * Renames an existing book.
 * Body: { id: string, name: string }
 */
export async function PATCH(request: Request) {
  try {
    await verifyAuth(request);
    const body = await request.json();

    if (!body.id || !body.name) {
      return NextResponse.json(
        { error: "Missing required fields: id and name" },
        { status: 400 },
      );
    }

    const db = requireDbAdmin();
    await db.collection(COLLECTION).doc(body.id).update({ name: body.name });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("books PATCH", err);
    return NextResponse.json(
      { error: "Unauthorized or failed" },
      { status: 401 },
    );
  }
}

/**
 * DELETE /api/admin/books?id=...
 * Deletes a book from Firestore.
 */
export async function DELETE(request: Request) {
  try {
    await verifyAuth(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const db = requireDbAdmin();
    await db.collection(COLLECTION).doc(id).delete();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("books DELETE", err);
    return NextResponse.json(
      { error: "Unauthorized or failed" },
      { status: 401 },
    );
  }
}
