import { getSiteConfig } from "@/lib/siteConfig";

export async function ProfileCaption({ id, name, title }: { id: string; name: string; title: string }) {
  const config = await getSiteConfig();
  const profile = config.profiles[id] ?? { name, title };
  return <div className="absolute inset-x-0 bottom-0 z-10 bg-sga-red/85 px-3 py-2 text-white">
    <h3 className="text-2xl font-semibold uppercase leading-none">{profile.name}</h3>
    <p className="mt-1 text-lg font-semibold uppercase leading-none">{profile.title}</p>
  </div>;
}
