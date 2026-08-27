import {
  getCommunities,
  getMultiLayerNetwork,
  getNetworkMetrics,
} from "@/lib/analysis";
import { PageHeader, Caveat, CrossLink, Empty } from "@/components/ui";
import NetworkGraph from "./NetworkGraph";

export const metadata = {
  title: "Network · Bangladesh Music Evolution",
  description:
    "The Bangladesh Music Preference Network: artists connected by shared bills, shared members and stated influences, with each edge layer switchable.",
};

export default function NetworkPage() {
  const network = getMultiLayerNetwork();
  const communities = getCommunities();
  const metrics = getNetworkMetrics();

  if (!network) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20">
        <Empty>
          Network data not found. Run <code>analysis/scripts/build_bmpn.py</code>{" "}
          and <code>analyze_bmpn.py</code>.
        </Empty>
      </div>
    );
  }

  const observed = metrics?.passes.observed;
  const nonTrivial =
    communities?.observed.communities.filter((c) => c.size >= 3) ?? [];

  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="Explore"
        title="The network"
        lede="Every act in the catalogue, connected by what can actually be documented: who shared a stage, who shared a member, and who named whom as an influence. Switch the layers on and off to see what each kind of evidence contributes."
        meta={
          observed ? (
            <>
              {network.node_count} acts · {observed.edge_count} observed edges ·
              Louvain modularity {observed.louvain_modularity} ·{" "}
              {nonTrivial.length} communities of 3+
            </>
          ) : null
        }
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <NetworkGraph network={network} communities={nonTrivial} />

        <Caveat>
          This is a <strong>co-appearance</strong> network, not a preference
          network. Its edges record shared bills, shared members and stated
          influences — none of which is audience-side evidence. The classic
          mainstream-rock community exists because Ayub Bachchu played in Souls,
          LRB and Nagar Baul; the folk strand&rsquo;s high centrality is festival
          programming policy, not shared listenership. Low centrality here is
          usually a gap in the concert record rather than a fact about an
          act&rsquo;s audience. A genuine preference network needs playlist or
          related-artist data, which this project does not have — see{" "}
          <CrossLink href="/data">data and methods</CrossLink>.
        </Caveat>
      </div>
    </div>
  );
}
