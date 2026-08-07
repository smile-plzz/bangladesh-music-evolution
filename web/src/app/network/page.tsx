import { getNetwork } from "@/lib/data";
import NetworkGraph from "./NetworkGraph";

export const metadata = { title: "Preference Network · Bangladesh Music Evolution" };

export default function NetworkPage() {
  const network = getNetwork();

  if (!network) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight">Preference Network</h1>
        <p className="text-neutral-400 mt-4">No network data available yet.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">
        Bangladesh Music Preference Network
      </h1>
      <p className="text-neutral-400 mt-2 max-w-2xl">{network.description}</p>
      <div className="flex gap-6 mt-4 text-sm text-neutral-500">
        <span>{network.node_count} nodes</span>
        <span>{network.edge_count} edges</span>
        <span>{network.isolated_node_count} isolated</span>
      </div>

      <div className="mt-8">
        <NetworkGraph network={network} />
      </div>
      <p className="text-xs text-neutral-600 mt-4">
        Node size reflects number of documented shared events. Hover a node to
        highlight its connections; click a name to view the artist profile.
      </p>
    </div>
  );
}
