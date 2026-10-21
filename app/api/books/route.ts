import { NextResponse } from "next/server";
import { requireDbAdmin } from "@/lib/firebase-admin";

const COLLECTION = "books";

/**
 * GET /api/books
 * Public route — no authentication required.
 * Returns all books ordered by uploadedAt descending.
 */
export async function GET() {
  try {
    const db = requireDbAdmin();
    const snapshot = await db
      .collection(COLLECTION)
      .orderBy("uploadedAt", "desc")
      .get();

    const books: Array<any> = [];
    snapshot.forEach((doc) => books.push({ id: doc.id, ...doc.data() }));

    return NextResponse.json(books);
  } catch (err) {
    console.error("books GET error", err);
    // Return empty array so the page still renders
    return NextResponse.json([], { status: 200 });
  }
}
