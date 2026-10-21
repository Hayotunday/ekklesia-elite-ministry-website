"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Edit,
  Trash,
  ImageIcon,
  Phone,
  Video,
  BookOpen,
  Settings,
  LayoutDashboard,
  Plus,
  FileText,
  Download,
  X,
} from "lucide-react";
import { auth } from "@/lib/firebase-client";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import AdminForm from "@/components/admin-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type ContactInfo,
  getContactInfo,
  saveContactInfo,
} from "@/lib/contact";
import {
  type GalleryItem,
  deleteGalleryItem,
  getGalleryItems,
} from "@/lib/gallery";
import {
  type Devotional,
  saveDevotional,
  deleteDevotional,
  getRecentDevotionals,
} from "@/lib/devotional";
import {
  type Book,
  getBooks,
  addBook,
  updateBook,
  deleteBook,
} from "@/lib/books";
import { formatPhoneNumber } from "@/lib/utils";
import { format } from "date-fns";

export default function AdminPage() {
  const pageSize = 8;

  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [totalGalleryItems, setTotalGalleryItems] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: "",
    phone: "",
    address: "",
  });
  const [oldContactInfo, setOldContactInfo] = useState<ContactInfo>({
    email: "",
    phone: "",
    address: "",
  });
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [showForm, setShowForm] = useState(false);

  // Devotional state
  const [isSavingDevotional, setIsSavingDevotional] = useState(false);
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [devotionalForm, setDevotionalForm] = useState<Devotional>({
    title: "",
    date: format(new Date(), "yyyy-MM-dd"),
    memoryVerse: { verse: "", text: "" },
    bibleText: { verse: "", text: "" },
    message: "",
    conclusion: "",
  });

  // Books state
  const [books, setBooks] = useState<Book[]>([]);
  const [showBookForm, setShowBookForm] = useState(false);
  const [isUploadingBook, setIsUploadingBook] = useState(false);
  const [bookName, setBookName] = useState("");
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [editingBookName, setEditingBookName] = useState("");
  const bookFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    fetchContact();
    fetchGallery(0);
    fetchDevotionals();
    fetchBooks();
    return unsub;
  }, []);

  const getToken = async () => {
    if (!user) return null;
    return user.getIdToken();
  };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const fetchContact = async () => {
    getContactInfo().then((info) => {
      if (info.email || info.phone || info.address) {
        setContactInfo(info);
      }
    });
  };

  const saveContact = async () => {
    setIsSubmitting(true);
    const token = await getToken();
    if (!token) {
      toast.error("Not authenticated");
      return;
    }
    const result = await saveContactInfo(contactInfo, token);
    if (result.success) {
      toast.success("Contact info saved");
      setMode("view");
    } else {
      toast.error(result.error || "Failed to save contact info");
    }
    setIsSubmitting(false);
  };

  const fetchGallery = async (p = 0) => {
    setLoadingGallery(true);

    const items = await getGalleryItems(p, pageSize);
    if (p === 0) {
      setGallery(items);
      setTotalGalleryItems(items.length); // Track total items in first page
      setIsLastPage(false); // Reset when loading from page 0
    } else {
      // Only append if we haven't already displayed these items
      // Calculate how many items we should have after this fetch
      const expectedTotal = (p + 1) * pageSize;
      const currentTotal = gallery.length + items.length;

      // Only append if we're getting new items (not duplicates)
      if (currentTotal <= expectedTotal && items.length > 0) {
        setGallery((prev) => {
          // Remove duplicates by checking item IDs
          const existingIds = new Set(prev.map((item) => item.id));
          const newItems = items.filter((item) => !existingIds.has(item.id));
          return [...prev, ...newItems];
        });
        setTotalGalleryItems(currentTotal);
      }
    }
    setLoadingGallery(false);
    setPage(p);
    // Set isLastPage if we got fewer items than expected (indicating we've reached the end)
    if (items.length < pageSize) setIsLastPage(true);
  };

  const handleDeleteGalleryItem = async (
    id?: string,
    publicId?: string,
    type?: string,
  ) => {
    if (!id) return;
    const token = await getToken();
    if (!token) return;
    const result = await deleteGalleryItem(id, publicId, type as string, token);
    if (result.success) {
      toast.success("Gallery item deleted");
      fetchGallery();
    } else {
      toast.error(result.error || "Failed to delete item");
    }
  };

  const fetchDevotionals = async () => {
    const items = await getRecentDevotionals(20);
    setDevotionals(items);
  };

  // ---------- Books handlers ----------
  const fetchBooks = async () => {
    const items = await getBooks();
    setBooks(items);
  };

  const handleAddBook = async () => {
    if (!bookName.trim() || !bookFile) {
      toast.error("Please provide a book name and select a PDF file.");
      return;
    }
    setIsUploadingBook(true);
    const token = await getToken();
    if (!token) {
      toast.error("Not authenticated");
      setIsUploadingBook(false);
      return;
    }

    // Upload the PDF to Cloudinary via the existing upload route
    const formData = new FormData();
    formData.append("file", bookFile);
    formData.append("resource_type", "raw"); // raw for PDFs

    let fileUrl = "";
    let publicId = "";
    try {
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) throw new Error("Upload failed");
      const uploadData = await uploadRes.json();
      fileUrl = uploadData.secure_url || uploadData.url;
      publicId = uploadData.publicId || uploadData.public_id;
    } catch {
      toast.error("Failed to upload PDF. Please try again.");
      setIsUploadingBook(false);
      return;
    }

    const result = await addBook(
      { name: bookName.trim(), fileUrl, publicId },
      token,
    );
    if (result.success) {
      toast.success("Book added successfully!");
      setShowBookForm(false);
      setBookName("");
      setBookFile(null);
      if (bookFileInputRef.current) bookFileInputRef.current.value = "";
      fetchBooks();
    } else {
      toast.error(result.error || "Failed to add book");
    }
    setIsUploadingBook(false);
  };

  const handleRenameBook = async (id: string) => {
    if (!editingBookName.trim()) return;
    const token = await getToken();
    if (!token) return;
    const result = await updateBook(id, editingBookName.trim(), token);
    if (result.success) {
      toast.success("Book renamed");
      setEditingBookId(null);
      setEditingBookName("");
      fetchBooks();
    } else {
      toast.error(result.error || "Failed to rename book");
    }
  };

  const handleDeleteBook = async (id?: string, publicId?: string) => {
    if (!id) return;
    const token = await getToken();
    if (!token) return;
    const result = await deleteBook(id, publicId, token);
    if (result.success) {
      toast.success("Book deleted");
      fetchBooks();
    } else {
      toast.error(result.error || "Failed to delete book");
    }
  };

  const handleSaveDevotional = async () => {
    setIsSavingDevotional(true);
    const token = await getToken();
    if (!token) return;

    const result = await saveDevotional(devotionalForm, token);
    if (result.success) {
      toast.success("Devotional saved");
      fetchDevotionals();
      setShowForm(false);
      setDevotionalForm({
        title: "",
        date: format(new Date(), "yyyy-MM-dd"),
        memoryVerse: { verse: "", text: "" },
        bibleText: { verse: "", text: "" },
        message: "",
        conclusion: "",
      });
    } else {
      toast.error("Failed to save devotional");
    }

    setIsSavingDevotional(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Admin Portal</CardTitle>
            <CardDescription>
              Please log in to manage website content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={login} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 md:px-6 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard className="w-6 h-6 text-purple-600" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground ml-8">
            Manage your website content and devotionals.
          </p>
        </div>
        <Button variant="secondary" onClick={logout}>
          Logout
        </Button>
      </div>

      <Tabs defaultValue="devotionals" className="space-y-6">
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="devotionals" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Devotionals
          </TabsTrigger>
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Gallery
          </TabsTrigger>
          <TabsTrigger value="books" className="flex items-center gap-2">
            <FileText className="w-4 h-4" /> Books
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" /> Site Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="devotionals" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Daily Devotionals</CardTitle>
                <CardDescription>
                  Create and manage daily spiritual content.
                </CardDescription>
              </div>
              {showForm ? (
                <Button
                  onClick={() => {
                    setShowForm(false);
                    setDevotionalForm({
                      title: "",
                      date: format(new Date(), "yyyy-MM-dd"),
                      memoryVerse: { verse: "", text: "" },
                      bibleText: { verse: "", text: "" },
                      message: "",
                      conclusion: "",
                    });
                  }}
                >
                  Cancel
                </Button>
              ) : (
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" /> New Devotional
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {showForm && (
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-8 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={devotionalForm.title}
                        onChange={(e) =>
                          setDevotionalForm({
                            ...devotionalForm,
                            title: e.target.value,
                          })
                        }
                        placeholder="Today's Theme"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={devotionalForm.date}
                        onChange={(e) =>
                          setDevotionalForm({
                            ...devotionalForm,
                            date: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t"> */}
                  {/* <div className="space-y-4">
                    <h4 className="font-bold text-sm text-purple-700">
                      MEMORY VERSE
                    </h4>
                    <div className="space-y-2">
                      <Label>Reference (e.g. John 3:16)</Label>
                      <Input
                        value={devotionalForm.memoryVerse.verse}
                        onChange={(e) =>
                          setDevotionalForm({
                            ...devotionalForm,
                            memoryVerse: {
                              ...devotionalForm.memoryVerse,
                              verse: e.target.value,
                            },
                          })
                        }
                      />
                  {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <div className="space-y-4">
                      <h4 className="font-bold text-sm text-purple-700">
                        MEMORY VERSE
                      </h4>
                      <div className="space-y-2">
                        <Label>Reference (e.g. John 3:16)</Label>
                        <Input
                          value={devotionalForm.memoryVerse.verse}
                          onChange={(e) =>
                            setDevotionalForm({
                              ...devotionalForm,
                              memoryVerse: {
                                ...devotionalForm.memoryVerse,
                                verse: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Text</Label>
                        <Textarea
                          value={devotionalForm.memoryVerse.text}
                          onChange={(e) =>
                            setDevotionalForm({
                              ...devotionalForm,
                              memoryVerse: {
                                ...devotionalForm.memoryVerse,
                                text: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Text</Label>
                      <Textarea
                        value={devotionalForm.memoryVerse.text}
                        onChange={(e) =>
                          setDevotionalForm({
                            ...devotionalForm,
                            memoryVerse: {
                              ...devotionalForm.memoryVerse,
                              text: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div> */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm text-purple-700">
                      BIBLE TEXT
                    </h4>
                    <div className="space-y-2">
                      <Label>Reference</Label>
                      <Input
                        value={devotionalForm.bibleText.verse}
                        onChange={(e) =>
                          setDevotionalForm({
                            ...devotionalForm,
                            bibleText: {
                              ...devotionalForm.bibleText,
                              verse: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Text</Label>
                      <Textarea
                        value={devotionalForm.bibleText.text}
                        onChange={(e) =>
                          setDevotionalForm({
                            ...devotionalForm,
                            bibleText: {
                              ...devotionalForm.bibleText,
                              text: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  {/* </div> */}

                  <div className="space-y-2 pt-4 border-t">
                    <Label>Message Body</Label>
                    <Textarea
                      rows={8}
                      value={devotionalForm.message}
                      onChange={(e) =>
                        setDevotionalForm({
                          ...devotionalForm,
                          message: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Conclusion</Label>
                    <Textarea
                      value={devotionalForm.conclusion}
                      onChange={(e) =>
                        setDevotionalForm({
                          ...devotionalForm,
                          conclusion: e.target.value,
                        })
                      }
                    />
                  </div>

                  <Button
                    className="w-full"
                    disabled={isSavingDevotional}
                    onClick={handleSaveDevotional}
                  >
                    {isSavingDevotional ? "Saving..." : "Save Devotional"}
                  </Button>
                </div>
              )}

              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Title</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {devotionals.map((devo) => (
                      <tr key={devo.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium">{devo.date}</td>
                        <td className="px-4 py-3">{devo.title}</td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setDevotionalForm(devo);
                              setShowForm(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500"
                            onClick={async () => {
                              const token = await getToken();
                              if (!token || !devo.id) return;
                              await deleteDevotional(devo.id, token);
                              fetchDevotionals();
                            }}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" /> Gallery
              </CardTitle>
              <div className="flex items-center">
                <Button
                  size="sm"
                  variant={showForm ? "destructive" : "default"}
                  onClick={() => setShowForm(!showForm)}
                >
                  {showForm ? "Cancel" : "Add Media"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {showForm && <AdminForm onClose={() => setShowForm(false)} />}

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden group w-fit h-fit"
                  >
                    <div className="relative">
                      <div className="w-full h-48 bg-gray-200">
                        {item.type === "video" && item.videoUrl ? (
                          <div className="w-full h-full flex items-center justify-center bg-black">
                            <Video className="w-12 h-12 text-white" />
                          </div>
                        ) : item.imageUrl ? (
                          <Image
                            width={300}
                            height={200}
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            loading="eager"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-300">
                            <ImageIcon className="w-12 h-12 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() =>
                          handleDeleteGalleryItem(
                            item.id,
                            item.publicId,
                            item.type,
                          )
                        }
                        className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardContent className="p-3">
                      <p
                        className="font-semibold truncate text-sm"
                        title={item.title}
                      >
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {item.category}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {!isLastPage && gallery.length > 0 && (
                <div className="mt-6 flex justify-center">
                  <Button
                    onClick={() => fetchGallery(page + 1)}
                    disabled={loadingGallery || isLastPage}
                  >
                    {loadingGallery ? "Loading..." : "Load more"}
                  </Button>
                </div>
              )}
              {isLastPage && gallery.length > 0 && (
                <div className="mt-6 flex justify-center">
                  <p className="text-gray-500 text-sm">All items loaded</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== BOOKS TAB ===== */}
        <TabsContent value="books" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Books &amp; Resources
                </CardTitle>
                <CardDescription>
                  Upload and manage downloadable PDF books.
                </CardDescription>
              </div>
              <Button
                size="sm"
                variant={showBookForm ? "destructive" : "default"}
                onClick={() => {
                  setShowBookForm(!showBookForm);
                  setBookName("");
                  setBookFile(null);
                }}
              >
                {showBookForm ? (
                  <>
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-1" /> Add Book
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Book Form */}
              {showBookForm && (
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-4">
                  <h4 className="font-semibold text-sm text-purple-700 uppercase tracking-wide">
                    New Book
                  </h4>
                  <div className="space-y-2">
                    <Label htmlFor="book-name">Book Name</Label>
                    <Input
                      id="book-name"
                      value={bookName}
                      onChange={(e) => setBookName(e.target.value)}
                      placeholder="e.g. Foundations of Faith"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="book-file">PDF File</Label>
                    <input
                      id="book-file"
                      ref={bookFileInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setBookFile(e.target.files?.[0] ?? null)}
                      className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                    />
                    {bookFile && (
                      <p className="text-xs text-muted-foreground">
                        Selected: {bookFile.name} (
                        {(bookFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                  <Button
                    className="w-full"
                    disabled={isUploadingBook}
                    onClick={handleAddBook}
                  >
                    {isUploadingBook ? "Uploading..." : "Upload & Save Book"}
                  </Button>
                </div>
              )}

              {/* Books List */}
              {books.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No books yet. Add your first one above.</p>
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left">Book Name</th>
                        <th className="px-4 py-3 text-left">File</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {books.map((book) => (
                        <tr key={book.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3">
                            {editingBookId === book.id ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  value={editingBookName}
                                  onChange={(e) =>
                                    setEditingBookName(e.target.value)
                                  }
                                  className="h-8 text-sm"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter")
                                      handleRenameBook(book.id!);
                                    if (e.key === "Escape") {
                                      setEditingBookId(null);
                                      setEditingBookName("");
                                    }
                                  }}
                                  autoFocus
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleRenameBook(book.id!)}
                                >
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingBookId(null);
                                    setEditingBookName("");
                                  }}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <span className="font-medium">{book.name}</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <a
                              href={book.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 text-xs font-medium"
                            >
                              <Download className="w-3 h-3" /> View PDF
                            </a>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Rename"
                              onClick={() => {
                                setEditingBookId(book.id!);
                                setEditingBookName(book.name);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500"
                              title="Delete"
                              onClick={() =>
                                handleDeleteBook(book.id, book.publicId)
                              }
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" /> Contact Information
                </CardTitle>
                <CardDescription>
                  Update the public contact details for the ministry.
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                {mode === "view" && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setMode("edit");
                      setOldContactInfo(contactInfo);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </Button>
                )}

                {mode === "edit" && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setMode("view");
                        setContactInfo(oldContactInfo);
                      }}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>

                    <Button
                      size="sm"
                      onClick={saveContact}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save"}
                    </Button>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  value={contactInfo.email || ""}
                  disabled={mode === "view"}
                  onChange={(e) =>
                    setContactInfo((c) => ({ ...c, email: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Phone</Label>
                <Input
                  id="contact-phone"
                  value={formatPhoneNumber(contactInfo.phone || "")}
                  disabled={mode === "view"}
                  onChange={(e) =>
                    setContactInfo((c) => ({ ...c, phone: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-address">Address</Label>
                <Textarea
                  id="contact-address"
                  value={contactInfo.address || ""}
                  disabled={mode === "view"}
                  onChange={(e) =>
                    setContactInfo((c) => ({
                      ...c,
                      address: e.target.value,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Form Drawer (Legacy AdminForm for Gallery) */}
      {/* {showForm && <AdminForm onClose={() => setShowForm(false)} />} */}
    </div>
  );
}
