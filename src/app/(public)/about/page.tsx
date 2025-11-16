import Link from "next/link";
import Image from "next/image";

const leadershipTeam = [
  {
    name: "Datuk Dr. Hj. Azami Hj. Said Ph.D",
    title: "Managing Director",
    profileHref: "/about/managing-director",
  },
  {
    name: "Ms. Zarina Yusof",
    title: "Senior Vice President Finance",
  },
];

const companyFacts = [
  { label: "Company Name", value: "N.A.Z. Medical Supplies Sdn. Bhd." },
  { label: "Company No", value: "199901015149 (490049-M)" },
  { label: "Year Incorporated", value: "1999" },
  { label: "Type of Company", value: "Private Limited" },
  { label: "Nature of Business", value: "Medical Supplier" },
  { label: "Company Status", value: "Bumiputera" },
  {
    label: "Registration with Authority",
    value: "Kementerian Kewangan Malaysia K.KEW/K&B/D/02/494/357-05281",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-12 px-6 py-16">
      <section className="rounded-3xl border border-emerald-100 bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
          Our Vision
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">
          &ldquo;To be a reliable one stop provider of products and services to hospitals and healthcare centers.&rdquo;
        </h1>
      </section>

      <section className="overflow-hidden rounded-3xl border border-emerald-100 shadow-sm">
        <Image
          src="/img/aboutus.jpg"
          alt="NAZ Medical office overview"
          width={1600}
          height={500}
          className="h-64 w-full object-cover sm:h-80 lg:h-[24rem]"
          priority
        />
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.2fr,1.8fr]">
        <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
            Leadership Team
          </p>
          <ul className="mt-4 space-y-4 text-sm text-slate-700">
            {leadershipTeam.map((leader) => (
              <li key={leader.name}>
                {leader.profileHref ? (
                  <Link
                    href={leader.profileHref}
                    className="font-semibold text-emerald-800 underline decoration-emerald-400 decoration-2 underline-offset-4"
                  >
                    {leader.name}
                  </Link>
                ) : (
                  <p className="font-semibold text-emerald-800">{leader.name}</p>
                )}
                <p className="text-slate-500">{leader.title}</p>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-emerald-50 pt-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
              Company Profile
            </p>
            <dl className="mt-4 space-y-3 text-sm text-slate-700">
              {companyFacts.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-semibold text-slate-900">{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm space-y-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
              Management Team
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-700">
              We are led by an experienced management team, headed by our Managing Director Datuk Dr. Hj. Azami Hj. Said Ph.D. The team consistently pursues better performance by offering quality products at competitive prices and delivering reliable after-sales service to ensure high customer satisfaction. NAZ Medical Supplies Sdn. Bhd. has been awarded MS ISO 9001:2015, MS ISO 13485:2016 & MS ISO 14001:2015 certifications.
            </p>
          </div>
          <div className="border-t border-emerald-50 pt-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
              Office & Warehouse
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-700">
              Our headquarters house substantial office and warehouse space, complemented by branch offices in Kedah, Sabah, and Sarawak. This footprint ensures we can support customers across East Malaysia and the East Coast, providing inventory whenever it is needed and keeping deliveries on time.
            </p>
          </div>
        </div>
      </section>


      <section className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
          Commitment
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-slate-900">
          Building trust with hospitals and healthcare centers across Malaysia since 1999.
        </h3>
        <p className="mt-3 text-sm text-slate-600">
          We have a definite commitment and fundamental responsibility to ensure our employees work in safe healthy environment, We will comply with all safety and health laws and regulations and take all necessary steps to prevent work-related injuries and diseases including the following:
        </p>
        <ul className="mt-3 text-sm text-slate-600 text-left">
          <li>• Equipment and work system that are safe and without risks to health.</li>
          <li>• Intensive training and comprehensive informative instructions to ensure the safety and health of employees.</li>
          <li>• Promote a safe and healthy culture amongst employees.</li>
          <li>• Emphasis on the safety of workplace including entrances and exits.</li>
          <li>• Provide a safe office environment for employees, clients, contractors and visitors.</li>
        </ul>
      </section>
    </div>
  );
}
