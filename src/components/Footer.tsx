import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white px-6 py-8">
      <div className="mx-auto grid max-w-6xl gap-6 text-sga-red md:grid-cols-[auto_1fr_auto] md:items-center">
        <Image
          src="/images/aup-student-government-red.svg"
          alt="AUP Student Government Association"
          width={76}
          height={76}
          className="h-20 w-20"
        />
        <address className="not-italic">
          <p className="text-xl font-semibold leading-tight">
            The American University of Paris Student Government Association
          </p>
          <p className="mt-2 text-lg font-light leading-tight">6 Rue du Colonel Combes, 75007 Paris</p>
          <p className="text-lg font-light leading-tight">3rd Floor of the Combes Building</p>
          <Link href="mailto:sga@aup.edu" className="text-lg font-light leading-tight hover:underline">
            sga@aup.edu
          </Link>
        </address>
        <div className="text-left md:text-right">
          <p className="text-xl font-semibold uppercase">Follow</p>
          <div className="mt-2 flex gap-4 text-lg font-semibold uppercase md:justify-end">
            <Link href="/engagement/instagram" className="hover:underline">
              Instagram
            </Link>
            <Link href="/engagement/tiktok" className="hover:underline">
              Tik Tok
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
