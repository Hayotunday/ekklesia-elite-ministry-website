import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Devotional & Spiritual Growth | Daily Bible Teaching",
  description:
    "Start your day with spiritual nourishment, biblical reflection, memory verses, and prayer through the Daily Devotional by Ekklesia Elite Evangelical Ministry.",
  alternates: {
    canonical: "/devotional",
  },
  openGraph: {
    title: "Daily Devotional & Spiritual Growth | Ekklesia Elite",
    description:
      "Daily spiritual nourishment and biblical teachings by Ekklesia Elite Evangelical Ministry in Ikorodu, Lagos.",
    url: "/devotional",
  },
};

export default function DevotionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
