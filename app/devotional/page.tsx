"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  Download,
  BookOpen,
  Quote,
} from "lucide-react";
import { format } from "date-fns";
import { Devotional, getDevotionalByDate } from "@/lib/devotional";
import { Skeleton } from "@/components/ui/skeleton";

export default function DevotionalPage() {
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [devotional, setDevotional] = useState<Devotional | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDevo() {
      setLoading(true);
      const data = await getDevotionalByDate(selectedDate);
      setDevotional(data);
      setLoading(false);
    }
    fetchDevo();
  }, [selectedDate]);

  const handleDownloadPdf = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10 print:p-0 print:bg-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 print:hidden">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              Daily Devotional
            </h1>
            <p className="text-slate-500">
              Spiritual nourishment for your soul
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-slate-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPdf}
              disabled={!devotional}
            >
              <Download className="w-4 h-4 mr-2" /> PDF
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : devotional ? (
          <article className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden print:shadow-none print:border-none">
            <div className="bg-purple-600 p-8 text-white text-center">
              <p className="text-purple-100 font-medium mb-2 uppercase tracking-widest text-sm">
                {format(new Date(devotional.date), "EEEE, MMMM do, yyyy")}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold">
                {devotional.title}
              </h2>
            </div>

            <div className="p-8 space-y-10">
              {/* Bible Text */}
              <section className="bg-slate-50 p-6 rounded-xl border-l-4 border-purple-500">
                <div className="flex items-center gap-2 text-purple-700 font-bold mb-3">
                  <BookOpen size={20} />
                  <h3>BIBLE TEXT: {devotional.bibleText.verse}</h3>
                </div>
                <p className="text-slate-700 leading-relaxed italic">
                  "{devotional.bibleText.text}"
                </p>
              </section>

              {/* Memory Verse */}
              {/* <section className="text-center max-w-2xl mx-auto py-4 border-y border-slate-100">
                <div className="flex justify-center text-purple-500 mb-2">
                  <Quote size={24} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2 uppercase tracking-wide text-sm">
                  Memory Verse
                </h3>
                <p className="text-xl font-medium text-slate-800 italic mb-1">
                  "{devotional.memoryVerse.text}"
                </p>
                <p className="text-purple-600 font-bold">
                  — {devotional.memoryVerse.verse}
                </p>
              </section> */}

              {/* Message */}
              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2">
                  The Message
                </h3>
                <div className="prose prose-slate max-w-none text-slate-700 leading-loose whitespace-pre-wrap">
                  {devotional.message}
                </div>
              </section>

              {/* Conclusion */}
              <section className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                <h3 className="font-bold text-purple-900 mb-2">
                  Conclusion / Prayer
                </h3>
                <p className="text-purple-800 leading-relaxed">
                  {devotional.conclusion}
                </p>
              </section>
            </div>
          </article>
        ) : (
          <Card className="text-center py-20">
            <CardContent>
              <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">
                No devotional found for this date.
              </p>
              <Button
                variant="link"
                className="mt-2 text-purple-600"
                onClick={() =>
                  setSelectedDate(format(new Date(), "yyyy-MM-dd"))
                }
              >
                Return to Today
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />

      <style jsx global>{`
        @media print {
          .print\\:hidden,
          header,
          footer,
          button {
            display: none !important;
          }
          body {
            background: white !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          article {
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
