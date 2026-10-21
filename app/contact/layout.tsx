import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us & Location in Ikorodu, Lagos | Counseling & Mentorship",
  description:
    "Get in touch with Ekklesia Elite Evangelical Ministry in Ikorodu, Lagos, Nigeria. Contact us for youth and teens mentorship, counseling, prayer requests, or partnership.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us & Location in Ikorodu, Lagos | Ekklesia Elite",
    description:
      "Get in touch with Ekklesia Elite Evangelical Ministry in Ikorodu, Lagos. Reach out for youth mentorship, emotional intelligence coaching, or prayer.",
    url: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
