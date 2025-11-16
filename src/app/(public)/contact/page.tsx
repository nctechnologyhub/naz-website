const mapLocations = [
  {
    title: "Headquarters (HQ)",
    addressLines: [
      "No.4, Jalan BP 4/7, Bandar Bukit Puchong",
      "47120 Puchong, Selangor, Malaysia",
    ],
    email: "info@nazmedical.com.my",
    phone: "603 8060 0295 / 96 / 97",
    lat: 2.9821551,
    lon: 101.6291135,
    googleMapsUrl: "https://maps.app.goo.gl/jqZLKh4scZBnEkUm8",
  },
  {
    title: "Kedah Branch",
    addressLines: [
      "No 23-A, Taman Intan, Jalan Datuk Kumbar",
      "05300 Alor Setar, Kedah Darul Aman",
    ],
    email: "sales_kedah@nazmedical.com.my",
    phone: "04 732 9458",
    lat: 6.1196783,
    lon: 100.3851771,
    googleMapsUrl: "https://maps.app.goo.gl/LJWKq6Cq1VpAZpbn7",
  },
];

const otherBranches = [
  {
    title: "Sabah Branch",
    addressLines: [
      "Lot E5 & E6, Block E, Cyber Square Commercial Centre",
      "Lintas-Kepayan Highway, 88200 Kota Kinabalu, Sabah",
    ],
    email: "sales_sabah@nazmedical.com.my",
    phone: "(60)15-4818 9017",
    fax: "(60)15-4818 9014",
  },
  {
    title: "Sarawak Branch",
    addressLines: [
      "Lot 843, Block 7, Muara Tebas Land District",
      "Sejingkat Industrial Park, 93050 Kuching, Sarawak",
    ],
    email: "sales_sarawak@nazmedical.com.my",
    phone: "(60)82-433566",
  },
];

const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
function googleMapEmbed(lat: number, lon: number) {
  if (!mapsKey) return "";
  return `https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${lat},${lon}&zoom=17`;
}

export default function ContactPage() {
  return (
    <div className="space-y-10 bg-gradient-to-b from-white via-[#F7FAF7] to-[#E8F5E8] px-6 py-16">
      <div className="mx-auto max-w-4xl space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
          Contact
        </p>
        <h1 className="text-4xl font-semibold text-slate-900">
          Get in touch with NAZ Medical
        </h1>
        <p className="text-lg text-slate-600">
          We respond within the same business day. Call, email, or visit any of
          our locations below.
        </p>
      </div>

      <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.2fr,1.8fr]">
        <div className="space-y-6 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
              Hotline
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              +603 8060 0295 / 96 / 97
            </p>
            <p className="text-sm text-slate-500">
              Monday–Friday: 9 AM – 6 PM · Saturday (HQ): 9 AM – 12:30 PM
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
              General email
            </p>
            <a
              href="mailto:info@nazmedical.com.my"
              className="mt-2 inline-flex items-center text-lg font-semibold text-emerald-700"
            >
              info@nazmedical.com.my
            </a>
            <p className="text-sm text-slate-500">
              Send us procurement briefs, partnership requests, or support
              queries.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
              Branch contacts
            </p>
            <ul className="mt-2 space-y-2 text-sm text-slate-600">
              <li>
                Kedah:{" "}
                <a
                  href="mailto:sales_kedah@nazmedical.com.my"
                  className="font-semibold text-emerald-700"
                >
                  sales_kedah@nazmedical.com.my
                </a>
              </li>
              <li>
                Sabah:{" "}
                <a
                  href="mailto:sales_sabah@nazmedical.com.my"
                  className="font-semibold text-emerald-700"
                >
                  sales_sabah@nazmedical.com.my
                </a>
              </li>
              <li>
                Sarawak:{" "}
                <a
                  href="mailto:sales_sarawak@nazmedical.com.my"
                  className="font-semibold text-emerald-700"
                >
                  sales_sarawak@nazmedical.com.my
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="space-y-6">
          {mapLocations.map((location) => (
            <article
              key={location.title}
              className="grid gap-0 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm md:grid-cols-2"
            >
              <div className="space-y-2 px-6 py-5">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
                  {location.title}
                </p>
                <p className="text-base text-slate-700">
                  {location.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
                <p className="text-xs text-slate-500">
                  Tel: {location.phone}
                </p>
                <a
                  href={`mailto:${location.email}`}
                  className="text-sm font-semibold text-emerald-700"
                >
                  {location.email}
                </a>
              </div>
              <div className="h-64 w-full overflow-hidden rounded-br-3xl rounded-tr-3xl md:rounded-none">
                {mapsKey ? (
                  <iframe
                    title={`${location.title} map`}
                    src={googleMapEmbed(location.lat, location.lon)}
                    loading="lazy"
                    className="h-full w-full"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm text-slate-500">
                    Map unavailable. Add Google Maps key.
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
        {otherBranches.map((branch) => (
          <article
            key={branch.title}
            className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
              {branch.title}
            </p>
            <p className="mt-2 text-base text-slate-700">
              {branch.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <p className="text-sm text-slate-600">
              Tel: {branch.phone}
              {branch.fax ? ` · Fax: ${branch.fax}` : null}
            </p>
            <a
              href={`mailto:${branch.email}`}
              className="text-sm font-semibold text-emerald-700"
            >
              {branch.email}
            </a>
          </article>
        ))}
      </section>
    </div>
  );
}
