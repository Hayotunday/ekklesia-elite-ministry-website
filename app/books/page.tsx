import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BookOpen, Download, FileText } from "lucide-react";
import Link from "next/link";
import { requireDbAdmin } from "@/lib/firebase-admin";

interface Book {
  id: string;
  name: string;
  fileUrl: string;
  uploadedAt?: any;
}

async function fetchBooks(): Promise<Book[]> {
  try {
    const db = requireDbAdmin();
    const snapshot = await db
      .collection("books")
      .orderBy("uploadedAt", "desc")
      .get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Book);
  } catch (error) {
    console.error("Failed to load books for prerendering:", error);
    return [];
  }
}

// Helper functio to force download flag into cludinary URL
const getDownloadableUrl = (url: string) => {
  if (!url) return "";
  if (url.includes("/upload/")) {
    if (url.includes("fl_attachment")) return url; // already has the flag

    return url.replace("/upload/", "/upload/f_pdf,fl_attachment/");
  }
  return url;
};

export const metadata = {
  title: "Books | Ekklesia Elite – Repairer of the Breach",
  description:
    "Download free Christian books and resources from Ekklesia Elite Network and Evangelical Ministry.",
};

export default async function BooksPage() {
  const books = await fetchBooks();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="bg-purple-600 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 rounded-full text-sm font-semibold uppercase tracking-wider mb-6">
            <BookOpen className="w-4 h-4" />
            Free Resources
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Books &amp; Resources
          </h1>
          <p className="text-purple-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Download our collection of Christian books, guides, and devotional
            materials — completely free, to deepen your faith journey.
          </p>
        </div>
      </section>

      {/* Books Grid */}
      <section className="bg-gray-50 py-16 md:py-24 flex-1">
        <div className="max-w-7xl mx-auto px-6">
          {books.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                No books available yet
              </h2>
              <p className="text-gray-500 max-w-md mx-auto">
                Check back soon — we&apos;re adding new resources regularly.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Available Downloads
                </h2>
                <p className="text-gray-500">
                  {books.length} resource{books.length !== 1 ? "s" : ""}{" "}
                  available
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {books.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden group"
                  >
                    {/* PDF Preview Area */}
                    <div className="bg-linear-to-br from-purple-50 to-purple-100 p-8 flex items-center justify-center">
                      <div className="relative">
                        <div className="w-20 h-24 bg-white rounded-lg shadow-md flex flex-col items-center justify-center border border-purple-200 group-hover:scale-105 transition-transform duration-300">
                          <FileText className="w-8 h-8 text-purple-600 mb-1" />
                          <span className="text-xs font-bold text-red-500 tracking-widest">
                            PDF
                          </span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                          <Download className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Book Info */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3
                        className="font-bold text-gray-900 text-base mb-1 line-clamp-2 leading-snug"
                        title={book.name}
                      >
                        {book.name}
                      </h3>
                      <p className="text-xs text-purple-600 font-semibold uppercase tracking-wide mb-4">
                        PDF Document
                      </p>

                      <div className="mt-auto">
                        <a
                          href={book.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={`${book.name}.pdf`}
                          className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors duration-200"
                          aria-label={`Download ${book.name}`}
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-purple-50 rounded-3xl p-8 md:p-12 border border-purple-100 text-center">
            <BookOpen className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Want to go deeper?
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto mb-6">
              Join our community and get access to daily devotionals, mentorship
              programs, and more spiritual resources.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors duration-200"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
