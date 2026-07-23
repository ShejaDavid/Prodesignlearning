import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";
import { SEO_KEYWORDS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Affiliations",
  description:
    "Prodesign Training's partnerships and accreditations — Autodesk, CIBSE, USGBC, and BIM Africa — bringing globally recognized standards to our courses.",
  keywords: [...SEO_KEYWORDS],
};

const PARTNERS: Array<{
  name: string;
  description: string;
  href: string;
  logoSrc: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
  logoClassName?: string;
  logoWrapperClassName?: string;
}> = [
  {
    name: "Autodesk",
    description:
      "As the only Autodesk-accredited training provider in Mauritius, we are proud to collaborate with the global leader in design and engineering software. Our Autodesk Revit courses are officially recognized, ensuring trainees receive industry-standard education and a pathway to Autodesk certifications.",
    href: "https://www.autodesk.com/",
    logoSrc: "/partners/autodesk.svg",
    logoAlt: "Autodesk logo",
    logoWidth: 220,
    logoHeight: 44,
    logoWrapperClassName: "bg-slate-900",
  },
  {
    name: "CIBSE",
    description:
      "Our affiliation with CIBSE (Chartered Institution of Building Services Engineers) underscores our commitment to delivering excellence in building services engineering. This partnership allows us to incorporate CIBSE standards into our training, preparing professionals to design and maintain efficient and sustainable building systems.",
    href: "https://www.cibse.org/",
    logoSrc: "/partners/cibse-hawk.png",
    logoAlt: "CIBSE brand mark",
    logoWidth: 160,
    logoHeight: 94,
  },
  {
    name: "USGBC",
    description:
      "We are in the process of obtaining accreditation with the USGBC (U.S. Green Building Council) to deliver LEED-related training programs. This affiliation will empower trainees to become LEED-certified professionals, equipping them with the skills to design and manage sustainable buildings that meet international green standards.",
    href: "https://www.usgbc.org/",
    logoSrc: "/partners/usgbc.svg",
    logoAlt: "USGBC logo",
    logoWidth: 88,
    logoHeight: 88,
  },
  {
    name: "BIM Africa",
    description:
      "As winners of the BIM Africa Award 2022, we are proud to collaborate with this prestigious organization to promote the adoption of BIM and digital construction practices in Mauritius and the wider region.",
    href: "https://bimafrica.org/",
    logoSrc: "/partners/bim-africa.png",
    logoAlt: "BIM Africa logo",
    logoWidth: 96,
    logoHeight: 96,
  },
];

const FUTURE_PARTNERS = [
  {
    name: "RICS",
    description:
      "Royal Institution of Chartered Surveyors — to bring internationally recognized certifications in construction and surveying.",
  },
  {
    name: "ASHRAE",
    description:
      "American Society of Heating, Refrigerating and Air-Conditioning Engineers — to integrate HVAC best practices into our building services engineering courses.",
  },
  {
    name: "EDGE",
    description:
      "Excellence in Design for Greater Efficiencies — to offer sustainability training aligned with the World Bank Group's green building certification.",
  },
  {
    name: "ISHRAE",
    description: "Expanding our sustainability and building-services training network.",
  },
];

const WHY_IT_MATTERS = [
  {
    title: "Enhanced Course Value",
    description:
      "Training programs accredited by global leaders provide you with certifications that are recognized and respected worldwide.",
  },
  {
    title: "Exclusive Learning Opportunities",
    description:
      "Gain access to cutting-edge tools, resources, and methodologies used by top professionals in the field.",
  },
  {
    title: "Career Advancement",
    description:
      "Accredited courses open doors to international opportunities, helping you stand out in the competitive construction industry.",
  },
  {
    title: "Industry-Relevant Curriculum",
    description:
      "Our partners help us stay at the forefront of industry trends, ensuring our courses are practical and up-to-date.",
  },
];

export default function AffiliationsPage() {
  return (
    <div className="min-h-screen">
      <section className="border-b border-border bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <FadeIn>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Partnering with Global Leaders to Deliver{" "}
              <span className="gradient-text">World-Class Training</span>
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              At Prodesign Training, we believe in the power of collaboration to
              enhance the quality of education and professional development. Our
              partnerships with globally recognized institutions and
              organizations ensure that our training programs meet the highest
              industry standards, providing our trainees with certifications and
              skills that are valued worldwide.
            </p>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              By aligning with these esteemed partners, we aim to bring the
              latest innovations, industry insights, and professional
              accreditations to our courses. These affiliations not only
              strengthen the credibility of our programs but also provide you
              with opportunities to excel in the global construction industry.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-16">
        <FadeIn>
          <h2 className="text-2xl font-bold md:text-3xl">
            Our Esteemed Partners and Affiliations
          </h2>
        </FadeIn>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {PARTNERS.map((partner, index) => (
            <FadeIn key={partner.name} delay={index * 0.05}>
              <Card className="h-full transition-shadow hover:premium-shadow">
                <CardContent className="p-6">
                  <Link
                    href={partner.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-2xl"
                  >
                    <div
                      className={`flex min-h-24 w-fit min-w-40 items-center justify-center rounded-2xl border border-border bg-card px-5 py-4 ${partner.logoWrapperClassName ?? ""}`}
                    >
                      <Image
                        src={partner.logoSrc}
                        alt={partner.logoAlt}
                        width={partner.logoWidth}
                        height={partner.logoHeight}
                        className={partner.logoClassName}
                      />
                    </div>
                  </Link>
                  <h3 className="mt-5 font-semibold">{partner.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {partner.description}
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        <div className="mt-20">
          <FadeIn>
            <h2 className="text-2xl font-bold md:text-3xl">Future Collaborations</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              We are continuously expanding our network of partnerships to
              provide even greater value to our trainees. Our goal is to
              collaborate with leading institutions such as:
            </p>
          </FadeIn>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FUTURE_PARTNERS.map((partner, index) => (
              <FadeIn key={partner.name} delay={index * 0.05}>
                <Card className="h-full border-dashed">
                  <CardContent className="p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                      <Globe2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <h3 className="mt-3 font-semibold">{partner.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {partner.description}
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <FadeIn>
            <h2 className="text-2xl font-bold md:text-3xl">
              Why These Partnerships Matter to You
            </h2>
          </FadeIn>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {WHY_IT_MATTERS.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.05}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>

        <FadeIn delay={0.2}>
          <div className="mt-20 rounded-2xl hero-gradient p-8 text-white md:p-12">
            <h2 className="text-2xl font-bold md:text-3xl">
              Join a Global Network of Professionals
            </h2>
            <p className="mt-3 max-w-xl text-white/80">
              When you choose Prodesign Training, you&apos;re not just enrolling
              in a course — you&apos;re becoming part of a global network of
              industry leaders and innovators. Our affiliations with renowned
              institutions provide you with unparalleled opportunities to grow
              and succeed in your career.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button variant="premium" asChild>
                <Link href="/courses">
                  Explore Our Courses
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                asChild
              >
                <Link href="/contact">Contact Us for Partnership Opportunities</Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
