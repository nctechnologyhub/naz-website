import Image from "next/image";

const biography = [
  "Datuk Dr. Hj. Azami Hj. Said DIMP,DMSM, AMN, Ph.D (USA) comes from Alor Setar, the capital of Kedah, Malaysia. His basic education was in pharmacy with a diploma from the Institute Pembantu Farmasi, PJ which is accredited by the Ministry of Health (MOH) Malaysia.",
  "He continued to complete a BBA and an MBA from universities in Malaysia and later earned an MBA from ACU Wyoming, USA. He was conferred a Ph.D in management by NCGU California, USA. His business experience began in 1997 as the sole proprietor of a medical supplies business before becoming a private limited company (Sdn. Bhd.) in July 1999.",
  "Datuk Dr. Hj. Azami is the president of the Malaysian Bumiputra Association of Medical and Scientific Suppliers (PERUTAMA) and a member of the economic advisory body Ahli Majlis Ekonomi Melayu Malaysia, focused on developing entrepreneurs. He remains active in youth social work and local politics on a voluntary basis.",
  "During his service in the Malaysia Armed Forces Medical Corps, Datuk Dr. Hj. Azami served in Somalia and Kampuchea as part of the UN Peacekeeping forces and received several medals, including recognition on the Sultan’s Birthday Honours List.",
  "He is a passionate Malaysian businessman who continues to drive excellence in business, education, social work, and local politics.",
];

export default function ManagingDirectorProfile() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-16">
      <section className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
          Managing Director Profile
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-900">
          Datuk Dr. Hj. Azami Hj. Said Ph.D
        </h1>
      </section>

      <div className="grid gap-8 rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm md:grid-cols-[320px,1fr]">
        <div className="flex flex-col items-center gap-4 text-center">
          <Image
            src="https://placehold.co/320x400?text=MD+Portrait"
            alt="Datuk Dr. Hj. Azami Hj. Said"
            width={320}
            height={400}
            className="rounded-2xl object-cover"
          />
          <div>
            <p className="text-lg font-semibold text-emerald-700">
              YBhgia Datuk Dr. Hj. Azami Hj. Said Ph.D
            </p>
            <p className="text-sm text-slate-500">Managing Director</p>
          </div>
        </div>
        <div className="space-y-4 text-sm leading-7 text-slate-700">
          {biography.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
