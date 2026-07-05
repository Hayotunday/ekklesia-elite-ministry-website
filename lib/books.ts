export interface Book {
  id?: string;
  name: string;
  fileUrl: string;
  // Cloudinary public_id for deletion
  publicId?: string;
  uploadedAt?: any;
}

export interface BookResult {
  success: boolean;
  error?: string;
  id?: string;
}

/**
 * Fetch all books from the public API.
 * No authentication required.
 */
export async function getBooks(): Promise<Book[]> {
  try {
    const res = await fetch("/api/books");
    if (res.ok) {
      return await res.json();
    }
    console.warn("Failed to fetch books:", res.status);
    return [];
  } catch (err) {
    console.error("Error fetching books:", err);
    return [];
  }
}

/**
 * Add a new book (admin only).
 * Requires authentication token.
 */
export async function addBook(
  book: Omit<Book, "id" | "uploadedAt">,
  authToken: string,
): Promise<BookResult> {
  try {
    const res = await fetch("/api/admin/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(book),
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, id: data.id };
    }

    const errorData = await res.json().catch(() => ({}));
    return {
      success: false,
      error: errorData.error || `HTTP ${res.status}`,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Error adding book:", err);
    return { success: false, error: message };
  }
}

/**
 * Update the name of a book (admin only).
 * Requires authentication token and book ID.
 */
export async function updateBook(
  id: string,
  name: string,
  authToken: string,
): Promise<BookResult> {
  try {
    const res = await fetch("/api/admin/books", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ id, name }),
    });

    if (res.ok) {
      return { success: true };
    }

    const errorData = await res.json().catch(() => ({}));
    return {
      success: false,
      error: errorData.error || `HTTP ${res.status}`,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Error updating book:", err);
    return { success: false, error: message };
  }
}

/**
 * Delete a book (admin only).
 * Requires authentication token and book ID.
 */
export async function deleteBook(
  id: string,
  publicId: string | undefined,
  authToken: string,
): Promise<BookResult> {
  try {
    // Delete the PDF from Cloudinary first if we have a publicId
    if (publicId) {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId, resourceType: "raw" }),
      });
    }

    const params = new URLSearchParams({ id });
    if (publicId) params.set("publicId", publicId);

    const res = await fetch(`/api/admin/books?${params.toString()}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (res.ok) {
      return { success: true };
    }

    const errorData = await res.json().catch(() => ({}));
    return {
      success: false,
      error: errorData.error || `HTTP ${res.status}`,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Error deleting book:", err);
    return { success: false, error: message };
  }
}
