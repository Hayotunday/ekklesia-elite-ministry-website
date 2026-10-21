import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Youth & Teens Ministry Programs in Ikorodu | Mentorship & Discipleship",
  description:
    "Explore mentorship, moral instruction, biblical life principles, emotional intelligence coaching, and youth leadership programs at Ekklesia Elite Evangelical Ministry in Ikorodu, Lagos.",
  alternates: {
    canonical: "/programs",
  },
  openGraph: {
    title: "Youth & Teens Ministry Programs in Ikorodu | Ekklesia Elite",
    description:
      "Explore mentorship, discipleship, moral instruction, and practical life skills at Ekklesia Elite Evangelical Ministry in Ikorodu, Lagos.",
    url: "/programs",
  },
};

export default function ProgramsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
