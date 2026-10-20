import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ministry in Action & Community Outreach Gallery",
  description:
    "Explore photos and videos of youth discipleship, worship fellowship, prayer meetings, and community outreach in Ikorodu and Lagos by Ekklesia Elite Evangelical Ministry.",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Ministry in Action & Community Outreach Gallery | Ekklesia Elite",
    description:
      "Explore photos and videos of youth programs, community outreach, and fellowship at Ekklesia Elite Evangelical Ministry in Ikorodu.",
    url: "/gallery",
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
