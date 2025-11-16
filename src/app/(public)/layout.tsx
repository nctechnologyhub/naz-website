import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Certifications", href: "/certifications" },
  { label: "Career", href: "/career" },
  { label: "Contact", href: "/contact" },
];

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/90 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold text-emerald-700">
          <Image
            src="/img/icon.png"
            alt="NAZ Medical logo"
            width={40}
            height={40}
            className="h-15 w-15 object-cover"
            priority
          />
          <span>N.A.Z Medical Supplies</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-emerald-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="relative md:hidden">
          <input
            type="checkbox"
            id="mobile-nav-toggle"
            className="peer hidden"
          />
          <label
            htmlFor="mobile-nav-toggle"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-emerald-200 text-emerald-700"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="space-y-1">
              <span className="block h-0.5 w-5 bg-current"></span>
              <span className="block h-0.5 w-5 bg-current"></span>
              <span className="block h-0.5 w-5 bg-current"></span>
            </span>
          </label>
          <div className="peer-checked:opacity-100 peer-checked:pointer-events-auto pointer-events-none absolute right-0 top-12 hidden w-56 flex-col gap-3 rounded-2xl border border-emerald-100 bg-white p-4 text-sm font-medium text-slate-700 shadow-lg peer-checked:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-2 transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                {link.label}
              </Link>
            ))}
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} NAZ Medical
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  const quickLinks = NAV_LINKS.slice(1);
  const socials = [
    { label: "LinkedIn", href: "https://www.linkedin.com" },
    { label: "Instagram", href: "https://www.instagram.com" },
    { label: "Facebook", href: "https://www.facebook.com" },
  ];

  const offices = [
    {
      label: "Official Address & Postal Address",
      address: [
        "No.4, Jalan BP 4/7, Bandar Bukit Puchong, 47120 Puchong, Selangor Darul Ehsan.",
      ],
      phone: "603 8060 0295 / 96 / 97 (Hunting Line)",
      fax: "603 8060 0318",
      email: "info@nazmedical.com.my",
    },
    {
      label: "Kedah Office Address",
      address: [
        "23-A, Taman Intan, Jalan Datuk Kumbar, 05300 Alor Setar, Kedah Darul Aman",
      ],
      phone: "604 732 9458",
      fax: "604 732 9394",
    },
  ];

  return (
    <footer className="border-t border-emerald-100 bg-[#1f1f1f] text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12">
                <div className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-lg font-semibold text-emerald-300">NAZ Medical</p>
            <p className="mt-2 text-sm text-white/80">
              Trusted provider of medical supplies and hospital solutions across
              the region. We blend clinical precision with human-centered service.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/60">
              Quick Links
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition hover:text-emerald-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <p className="font-semibold uppercase tracking-wide text-emerald-300">
              Accreditations & Achievements
            </p>
            <div className="flex items-center justify-center rounded-2xl bg-white/10 p-1">
              <Image
                src="/img/ISO_new2.jpg"
                alt="ISO Accreditation certificates"
                width={320}
                height={120}
                className="h-auto w-full max-w-sm rounded-xl object-contain"
              />
            </div>
            <Link
              href="/certifications"
              className="inline-flex w-fit items-center rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              Read More
            </Link>
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          {offices.map((office) => (
            <div key={office.label} className="space-y-2 text-sm">
              <p className="font-semibold uppercase tracking-wide text-emerald-300">
                {office.label}
              </p>
              <p className="font-medium leading-6 text-white/90">
                {office.address}
              </p>
              <p className="text-white/80">Tel: {office.phone}</p>
              <p className="text-white/80">Fax: {office.fax}</p>
              {office.email && (
                <p className="text-white/80">
                  Email:{" "}
                  <a
                    href={`mailto:${office.email}`}
                    className="font-semibold text-emerald-400"
                  >
                    {office.email}
                  </a>
                </p>
              )}
            </div>
          ))}

        </div>
        <div className="flex flex-col gap-4 border-t border-white/10 pt-4 text-sm text-white/70 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} NAZ Medical. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-3 text-white/80">
            {socials.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm transition hover:text-emerald-300"
              >
                {item.label}
              </a>
            ))}
          </div>
          <Link
            href="/staff/sign-in"
            className="inline-flex w-fit items-center rounded-full border border-white/20 bg-transparent px-4 py-2 text-sm font-medium text-white transition hover:border-emerald-400 hover:text-emerald-300"
          >
            Staff Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
