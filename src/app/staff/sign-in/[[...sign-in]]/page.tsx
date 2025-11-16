import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function StaffSignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#F7FAF7] to-[#E3F3E3] px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-xl shadow-emerald-100">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
          Staff Portal Access
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Secure access for staff and partners. Need help? Email{" "}
            <Link href="mailto:support@nazmedical.com" className="text-emerald-700">
            support@nazmedical.com
          </Link>
        </p>
        <div className="mt-8 flex justify-center">
          <SignIn fallbackRedirectUrl="/portal/dashboard" />
        </div>
      </div>  
    </div>
  );
}
