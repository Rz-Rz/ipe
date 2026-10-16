// The bridge as a process: the service on a loopback port, until the process ends.
import { IpeService } from "../main/service.js";
import { startBridge } from "./server.js";

export async function main(port: number): Promise<void> {
  const bridge = await startBridge(new IpeService(), port);
  process.stdout.write(`IPE bridge listening on http://127.0.0.1:${bridge.port}\n`);
  const stop = () => void bridge.close().then(() => process.exit(0));
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
}
