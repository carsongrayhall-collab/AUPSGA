"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/components/navigation";

export function Header() {
  const pathname = usePathname();

  const isActiveItem = (item: (typeof navItems)[number]) => {
    if (item.href) {
      return item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
    }

    return item.items?.some((dropdownItem) => pathname.startsWith(dropdownItem.href)) ?? false;
  };

  return (
    <header className="sticky top-0 z-50 bg-sga-red text-white shadow-[0_1px_0_rgba(0,0,0,0.12)]">
      <div className="flex min-h-16 w-full items-center gap-4 px-3 sm:px-4 lg:min-h-[6.25rem] lg:gap-8 lg:px-3">
        <Link href="/" className="flex min-w-0 items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:gap-5">
          <Image
            src="/images/aup-student-government-white.svg"
            alt="AUP Student Government Association"
            width={48}
            height={48}
            priority
            className="h-12 w-12 shrink-0 lg:h-[5.25rem] lg:w-[5.25rem]"
          />
          <span className="max-w-52 text-[0.78rem] font-semibold uppercase leading-[0.95] text-white sm:max-w-64 lg:max-w-[28rem] lg:text-[1.55rem] lg:leading-[1.12]">
            The American University of Paris
            <br />
            Student Government Association
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-6 xl:gap-8">
            {navItems.map((item) => {
              const isActive = isActiveItem(item);

              return (
              <li key={item.label} className="group relative">
                {item.href ? (
                  <Link
                    href={item.href}
                    className={[
                      "inline-flex h-11 items-center rounded-[3px] px-3 text-[1.05rem] font-semibold uppercase leading-none transition",
                      isActive
                        ? "bg-white text-sga-red shadow-[0_1px_2px_rgba(0,0,0,0.18)]"
                        : "text-white hover:bg-white/15 focus-visible:bg-white/15",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <>
                    <button
                      type="button"
                      className={[
                        "inline-flex h-11 items-center rounded-[3px] px-3 text-[1.05rem] font-semibold uppercase leading-none transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                        isActive
                          ? "bg-white text-sga-red shadow-[0_1px_2px_rgba(0,0,0,0.18)]"
                          : "text-white hover:bg-white/15 focus-visible:bg-white/15",
                      ].join(" ")}
                      aria-haspopup="true"
                    >
                      {item.label}
                    </button>
                    <div className="pointer-events-none absolute left-0 top-full min-w-max pt-2 opacity-0 transition duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                      <ul className="bg-white/85 px-3 py-2 text-[1rem] font-light uppercase leading-[1.2] text-sga-red shadow-[0_8px_20px_rgba(0,0,0,0.14)] backdrop-blur-sm">
                        {item.items?.map((dropdownItem) => (
                          <li key={dropdownItem.href}>
                            <Link
                              href={dropdownItem.href}
                              className="block whitespace-nowrap py-1.5 outline-none transition hover:text-black focus-visible:text-black focus-visible:underline"
                            >
                              {dropdownItem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </li>
            );
            })}
          </ul>
        </nav>
      </div>

      <nav aria-label="Primary navigation mobile" className="border-t border-white/20 px-4 py-2 lg:hidden">
        <ul className="flex flex-wrap gap-2 text-[0.72rem] font-semibold uppercase">
          {navItems.map((item) => {
            const isActive = isActiveItem(item);

            return (
            <li key={item.label} className="shrink-0">
              {item.href ? (
                <Link
                  href={item.href}
                  className={isActive ? "rounded-[3px] bg-white px-3 py-1.5 text-sga-red" : "block px-2 py-1.5 text-white"}
                >
                  {item.label}
                </Link>
              ) : (
                <details className="group/mobile">
                  <summary className="cursor-pointer list-none px-2 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white [&::-webkit-details-marker]:hidden">
                    {item.label}
                  </summary>
                  <ul className="mt-1 min-w-max bg-white/90 px-3 py-2 font-light text-sga-red shadow-[0_8px_20px_rgba(0,0,0,0.14)]">
                    {item.items?.map((dropdownItem) => (
                      <li key={dropdownItem.href}>
                        <Link href={dropdownItem.href} className="block whitespace-nowrap py-1.5">
                          {dropdownItem.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </li>
          );
          })}
        </ul>
      </nav>
    </header>
  );
}
