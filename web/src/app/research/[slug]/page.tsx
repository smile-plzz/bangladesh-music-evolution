import Link from "next/link";
import { notFound } from "next/navigation";
import { getResearchDoc, getResearchDocs } from "@/lib/research";
import Markdown from "@/components/Markdown";

const REPO = "https://github.com/smile-plzz/bangladesh-music-evolution";

export function generateStaticParams() {
  return getResearchDocs().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/research/[slug]">) {
  const { slug } = await params;
  const found = getResearchDoc(slug);
  if (!found) return { title: "Not found · Bangladesh Music Evolution" };
  return {
    title: `${found.doc.title} · Bangladesh Music Evolution`,
    description: found.doc.summary,
  };
}

export default async function ResearchDocPage({
  params,
}: PageProps<"/research/[slug]">) {
  const { slug } = await params;
  const found = getResearchDoc(slug);
  if (!found) notFound();

  const { doc, body } = found;
  const siblings = getResearchDocs().filter((d) => d.group === doc.group);
  const index = siblings.findIndex((d) => d.slug === doc.slug);
  const prev = index > 0 ? siblings[index - 1] : null;
  const next = index < siblings.length - 1 ? siblings[index + 1] : null;

  return (
    <div className="pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-12">
        <Link
          href="/research"
          className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          ← All research
        </Link>

        <article className="mt-8">
          <Markdown body={body} />
        </article>

        <footer className="mt-14 border-t border-neutral-800 pt-6">
          <div className="flex flex-wrap justify-between gap-4 text-sm">
            <div>
              {prev ? (
                <Link
                  href={`/research/${prev.slug}`}
                  className="text-emerald-400 hover:underline"
                >
                  ← {prev.title}
                </Link>
              ) : null}
            </div>
            <div className="text-right">
              {next ? (
                <Link
                  href={`/research/${next.slug}`}
                  className="text-emerald-400 hover:underline"
                >
                  {next.title} →
                </Link>
              ) : null}
            </div>
          </div>
          <p className="mt-6 text-xs text-neutral-600">
            Source:{" "}
            <a
              href={`${REPO}/blob/main/${
                doc.group === "case-studies"
                  ? `analysis/case-studies/${doc.file.split("/")[1]}`
                  : doc.file
              }.md`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-neutral-400 underline"
            >
              {doc.file}.md
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
