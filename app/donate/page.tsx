"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Copy, Banknote, ShieldCheck, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function Donate() {
  const accountDetails = {
    number: "0228815577",
    bank: "Guaranty Trust Bank (GTBank)",
    name: "Oyegoke Mojisola",
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(accountDetails.number);
    toast.success("Account number copied to clipboard!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-[url(/imgs/asset-14.jpeg)] bg-position-[center_-15rem] bg-cover bg-no-repeat py-20 md:py-32 rounded-none">
        <div className="absolute inset-0 bg-black/50" />
        <div className="max-w-7xl mx-auto px-6 text-center text-white relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Support Our Mission
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Your generosity empowers us to nurture the next generation for
            Christ and repair the breach in our society.
          </p>
        </div>
      </section>

      {/* Donation Content */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <Heart className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Partner with Us
            </h2>
            <p className="text-gray-600 text-lg">
              Every contribution helps us provide mentorship, spiritual
              guidance, and practical skills to teenagers and children in our
              community.
            </p>
          </div>

          <Card className="border-0 shadow-2xl overflow-hidden rounded-3xl">
            <div className="bg-purple-600 p-8 text-white text-center">
              <p className="text-purple-100 uppercase text-sm font-bold tracking-widest mb-2">
                Bank Transfer Details
              </p>
              <h3 className="text-2xl md:text-3xl font-bold">Direct Support</h3>
            </div>
            <CardContent className="p-8 md:p-12 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-purple-50 p-2 rounded-lg">
                      <Banknote className="text-purple-600 w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                        Bank Name
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {accountDetails.bank}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-purple-50 p-2 rounded-lg">
                      <CheckCircle className="text-purple-600 w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                        Account Name
                      </p>
                      <p className="text-lg font-bold text-gray-900 uppercase">
                        {accountDetails.name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-8 rounded-3xl flex flex-col items-center justify-center border border-slate-100 text-center">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-3">
                    Account Number
                  </p>
                  <p className="text-4xl font-mono font-bold text-purple-600 mb-6 tracking-tight">
                    {accountDetails.number}
                  </p>
                  <Button
                    onClick={copyToClipboard}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 rounded-2xl flex items-center gap-3 text-lg font-semibold w-full transition-transform active:scale-95"
                  >
                    <Copy size={20} /> Copy Account Number
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transparency Note */}
          <div className="mt-12 flex items-center justify-center gap-2 text-gray-500 text-sm italic">
            <ShieldCheck size={18} className="text-green-600" />
            Your support is handled with transparency and used strictly for
            ministry outreach and youth programs.
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="bg-white py-16 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            God Bless You for Your Kindness
          </h3>
          <p className="text-gray-600 italic">
            "Each of you should give what you have decided in your heart to
            give, not reluctantly or under compulsion, for God loves a cheerful
            giver." — 2 Corinthians 9:7
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
