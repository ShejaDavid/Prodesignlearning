"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Only confirmed partnerships appear here — the "future collaborations" on
// /affiliations (RICS, ASHRAE, EDGE, ISHRAE) aren't real affiliations yet, so
// they're intentionally left out of this homepage band.
const PARTNERS: Array<{
  name: string;
  logoSrc?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
  logoClassName?: string;
  logoWrapperClassName?: string;
}> = [
  {
    name: "Autodesk",
    logoSrc: "/partners/autodesk.svg",
    logoAlt: "Autodesk logo",
    logoWidth: 156,
    logoHeight: 32,
    logoWrapperClassName: "bg-slate-900",
  },
  {
    name: "CIBSE",
  },
  {
    name: "USGBC",
    logoSrc: "/partners/usgbc.svg",
    logoAlt: "USGBC logo",
    logoWidth: 38,
    logoHeight: 38,
  },
  {
    name: "BIM Africa",
    logoSrc: "/partners/bim-africa.png",
    logoAlt: "BIM Africa logo",
    logoWidth: 44,
    logoHeight: 44,
  },
];

// Duplicated once so the strip can loop seamlessly: animating from 0% to -50%
// moves exactly one full set of items, landing back on an identical frame.
const LOOP_ITEMS = [...PARTNERS, ...PARTNERS];

export function AffiliationsMarquee() {
  return (
    <section className="border-y border-border bg-muted/30 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Trusted &amp; Accredited By
        </p>

        <div
          className="relative mt-8 overflow-hidden [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
        >
          <motion.div
            className="flex w-max items-center gap-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 25, ease: "linear", repeat: Infinity }}
          >
            {LOOP_ITEMS.map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="flex shrink-0 items-center gap-3 rounded-2xl border border-border bg-background px-6 py-4 premium-shadow"
              >
                {partner.logoSrc ? (
                  <div
                    className={`flex h-11 min-w-11 items-center justify-center rounded-xl bg-secondary/10 px-2 ${partner.logoWrapperClassName ?? ""}`}
                  >
                    <Image
                      src={partner.logoSrc}
                      alt={partner.logoAlt ?? `${partner.name} logo`}
                      width={partner.logoWidth ?? 40}
                      height={partner.logoHeight ?? 40}
                      className={partner.logoClassName}
                    />
                  </div>
                ) : (
                  <div className="flex h-11 items-center justify-center rounded-xl bg-secondary/10 px-3 text-sm font-semibold text-secondary">
                    {partner.name}
                  </div>
                )}
                <span className="whitespace-nowrap font-semibold text-foreground">
                  {partner.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/affiliations"
            className="text-sm font-medium text-secondary hover:underline"
          >
            View our affiliations &amp; accreditations
          </Link>
        </div>
      </div>
    </section>
  );
}
