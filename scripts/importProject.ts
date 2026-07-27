import { cleanEnvironment, restoreEnvironment } from "@kontent-ai/data-ops";
import * as dotenv from "dotenv";

dotenv.config();

const environmentId = process.env.VITE_ENVIRONMENT_ID;
const mapiKey = process.env.VITE_MANAGEMENT_API_KEY;

if (!environmentId || !mapiKey) {
  throw new Error("VITE_KONTENT_ENVIRONMENT_ID and VITE_KONTENT_API_KEY must be set");
}

if (!process.env.npm_config_filename) {
  throw new Error('You have to provide a filename of backup zip file. Provide the "filename" parameter directly without -- (e.g. npm run model:import --filename="<path>").');
}

await cleanEnvironment({
  environmentId,
  apiKey: mapiKey,
});

// The plan allows max 3 spaces. The backup defines Public Web / Intranet / Regulated Docs, so
// remove the auto-present default space (if any) before restore to stay within the limit.
await fetch(`https://manage.kontent.ai/v2/projects/${environmentId}/spaces/codename/default_space`, {
  method: "DELETE",
  headers: { Authorization: `Bearer ${mapiKey}` },
}).catch(() => {});

await restoreEnvironment({
  environmentId,
  apiKey: mapiKey,
  fileName: process.env.npm_config_filename,
});
