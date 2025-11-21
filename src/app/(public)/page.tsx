
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const productCategories = [
  {
    name: "Anesthetic and Respiratory Devices",
    description: "Ventilators, anesthesia systems, and respiratory care accessories.",
  },
  {
    name: "Electro Mechanical Medical Devices",
    description: "Powered treatment and monitoring equipment for modern care.",
  },
  {
    name: "Hospital Hardware",
    description: "Beds, stretchers, surgical lights, and essential ward infrastructure.",
  },
  {
    name: "In Vitro Diagnostic Devices",
    description: "Laboratory analyzers, reagents, and specimen collection systems.",
  },
  {
    name: "Ophthalmic and optical devices",
    description: "Vision screening, surgical optics, and eye-care instruments.",
  },
  {
    name: "Reusable devices",
    description: "Autoclavable instruments and devices built for repeated use.",
  },
  {
    name: "Single-use Devices",
    description: "Sterile disposables designed for single patient contact.",
  },
  {
    name: "Assistive Products for Persons With Disability",
    description: "Mobility aids and daily living supports that improve accessibility.",
  },
  {
    name: "Laboratory Equipment",
    description: "Benchtop equipment, consumables, and lab-process tools.",
  },
];

const registeredBrands = [
  "NazCare®",
  "SaniTize®",
  "EnsureTest®",
  "VacuBlood®",
  "GluconazAT75®",
];

const certifications = [
  { label: "ISO 13485:2016", detail: "Medical DEvice: Quality Management System" },
  { label: "ISO 9001:2015", detail: "Quality Management Systems" },
  { label: "GDPMD ", detail: "Goods Distribution Practise Medical Devices" },
  { label: "ISO 14001:2015", detail: "Environment Management System" },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const banners = useQuery(api.homeBanners.list, {}) ?? [];
  const cmsSlides = banners.map((banner) => ({
    headline: banner.title,
    body:
      banner.subtitle ??
      "Dedicated supply programs tailored to your facility needs.",
    image:
      banner.imageUrl ?? "https://placehold.co/1600x900?text=NAZ+Medical",
    ctaLabel: banner.ctaLabel ?? "Browse Products",
    ctaUrl: banner.ctaUrl ?? "/products",
  }));
  const slides = cmsSlides;
  const hasSlides = slides.length > 0;

  useEffect(() => {
    if (!hasSlides || slides.length <= 1) return;
    const id = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(id);
  }, [hasSlides, slides.length]);

  const fallbackSlide = {
    headline: "Trusted partner for hospitals and healthcare centers across Malaysia.",
    body: "Our team blends regulatory rigor, clinical partnerships, and logistics expertise to keep your facilities supplied.",
    image: "img/icon.png",
    ctaLabel: "Browse Products",
    ctaUrl: "/products",
  };
  const safeIndex = hasSlides ? currentSlide % slides.length : 0;
  const activeSlide = hasSlides ? slides[safeIndex] : fallbackSlide;

  return (
    <div className="space-y-20 bg-gradient-to-b from-white via-[#F7FAF7] to-[#E8F5E8] pb-20 pt-0">
      <section className="px-0">
          <div className="relative isolate h-[600px] w-full overflow-hidden bg-emerald-900 text-white transition-all duration-700">
            <Image
              src={activeSlide.image}
              alt={activeSlide.headline}
              fill
              priority
              unoptimized
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-l from-emerald-950/95 via-emerald-900/90 to-emerald-800/1" />
            <div className="relative ml-auto flex h-full w-full flex-col justify-center gap-8 px-6 py-12 text-left sm:px-10 lg:w-2/4 lg:max-w-5xl lg:items-end lg:px-20 lg:text-right">
              <div className="w-full space-y-6 lg:max-w-3xl">
                <p className="inline-flex rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100">
                  Trusted Provider Since 1999
                </p>
                <h1 className="text-4xl font-bold text-white drop-shadow-lg sm:text-5xl">
                  {activeSlide!.headline}
                </h1>
                <p className="text-lg text-white/80">
                  {activeSlide!.body}
                </p>
                <div className="flex flex-wrap justify-start gap-4 lg:justify-end">
                  <Link
                    href={activeSlide!.ctaUrl ?? "/products"}
                    className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5"
                  >
                    {activeSlide!.ctaLabel ?? "Browse Products"}
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                  >
                    Request Quotation
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 lg:justify-end">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    aria-label={`Go to slide ${index + 1}`}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition ${
                      currentSlide === index
                        ? "w-12 bg-white"
                        : "w-6 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-10 shadow-lg shadow-emerald-100">
            <h2 className="text-2xl font-semibold text-slate-900">
              Your trusted healthcare supply partner.
            </h2>
            <p className="mt-4 text-slate-600">
              N.A.Z Medical SUpplies Sdn. Bhd. supports hospitals, clinics, and laboratories across the GCC with curated product catalogs, compliance-ready documentation, and a support team who knows healthcare operations inside out.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li>• Dedicated account specialists</li>
              <li>• Project-based procurement for new facilities</li>
              <li>• 24/7 cold-chain monitoring and reporting</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-10">
            <h3 className="text-lg font-semibold text-emerald-900">
              Compliance & Certifications
            </h3>
            <p className="mt-3 text-sm text-emerald-900/80">
              Fully registered with Malaysia Ministry of Health (MOH) for leading global manufacturers.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 text-center">
              {certifications.map((cert) => (
                <div
                  key={cert.label}
                  className="rounded-2xl border border-emerald-200 bg-white px-4 py-5 shadow-sm"
                >
                  <p className="text-sm font-semibold text-emerald-700">
                    {cert.label}
                  </p>
                  <p className="text-xs text-slate-500">{cert.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
          Registered Brands
        </p>
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-emerald-100 bg-white p-8 text-center text-slate-500 md:grid-cols-3 lg:grid-cols-5">
          {registeredBrands.map((brand) => (
            <span key={brand} className="text-sm font-semibold">
              {brand}
            </span>
          ))}
        </div>
      </section>

      <section
        id="products"
        className="mx-auto max-w-6xl space-y-10 px-4 text-center sm:px-6"
      >
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
            Product Categories
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">
            Comprehensive catalog tailored to your facility.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {productCategories.map((category) => (
            <div
              key={category.name}
              className="rounded-3xl border border-emerald-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-lg font-semibold text-emerald-800">
                {category.name}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 md:grid-cols-2">
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50/80 p-8">
          <h3 className="text-lg font-semibold text-emerald-900">
            Careers at NAZ Medical
          </h3>
          <p className="mt-3 text-sm text-emerald-900/80">
            Be part of a fast-growing team modernizing healthcare supply chains. Explore roles across clinical product management, logistics, customer success, and engineering.
          </p>
          <Link
            href="/career"
            className="mt-6 inline-flex items-center rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-200"
          >
            View Open Roles
          </Link>
        </div>
        <div className="mx-auto max-w-5xl rounded-3xl border border-emerald-100 bg-white px-8 py-10 text-center shadow-lg shadow-emerald-100">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
            Ready to partner?
          </p>
          <h3 className="mt-3 text-3xl font-semibold text-slate-900">
            Let&apos;s create a responsive supply program for your facilities.
          </h3>
          <p className="mt-4 text-sm text-slate-600">
            Email <a href="mailto:hello@nazmedical.com" className="font-semibold text-emerald-700">info@nazmedical.com.my</a> or call +603 8060 0295 / 96 / 97. Our team responds within the same business day.
          </p>
        </div>
      </section>
    </div>
  );
}
