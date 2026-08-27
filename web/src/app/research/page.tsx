import Link from "next/link";
import { getResearchDocs } from "@/lib/research";
import { PageHeader, Empty } from "@/components/ui";

export const metadata = {
  title: "Research · Bangladesh Music Evolution",
  description:
    "Read the paper, the frameworks and the sound-evolution case studies behind the dataset.",
};

const GROUPS = [
  {
    key: "docs" as const,
    title: "Papers and documents",
    lede: "The study itself, and the documents it is built on.",
  },
  {
    key: "frameworks" as const,
    title: "Frameworks",
    lede: "The models the study uses — and where the data corrected them.",
  },
  {
    key: "case-studies" as const,
    title: "Case studies",
    lede: "Five acts and strands taken through the analytical dimensions in depth.",
  },
];

export default function ResearchPage() {
  const docs = getResearchDocs();

  if (docs.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20">
        <Empty>
          Research content not synced. Run <code>npm run sync-data</code>.
        </Empty>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="Read"
        title="The research"
        lede="The written half of the project. Start with the paper if you want the findings; start with the case studies if you want a single act in depth; start with the framework validation if you want to know where the study was wrong."
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-14">
        {GROUPS.map((g) => {
          const items = docs.filter((d) => d.group === g.key);
          if (items.length === 0) return null;
          return (
            <section key={g.key}>
              <h2 className="text-xl font-semibold">{g.title}</h2>
              <p className="mt-1.5 text-sm text-neutral-400">{g.lede}</p>
              <div className="mt-5 grid md:grid-cols-2 gap-4">
                {items.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/research/${d.slug}`}
                    className="group rounded-lg border border-neutral-800 bg-neutral-900/50 p-5 hover:border-emerald-500/60 transition-colors"
                  >
                    <div className="font-medium group-hover:text-emerald-300 transition-colors">
                      {d.title}
                    </div>
                    {d.summary ? (
                      <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                        {d.summary}
                      </p>
                    ) : null}
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
