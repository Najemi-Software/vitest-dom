import { expect } from "vitest";
import { plugins } from "pretty-format";
import { createColors, setupColors } from "vitest/utils";
import "../src/extend-expect";

// The inline snapshots serialize matcher-message colors (via ConvertAnsi),
// but vitest enables those colors from the environment — @vitest/utils'
// createColors sniffs NO_COLOR/FORCE_COLOR and hard-disables under
// GITHUB_ACTIONS, ignoring its isTTY argument. Mask those vars while
// building a forced-on palette so output is identical in terminals, pipes
// and CI.
const maskedEnv = {
  GITHUB_ACTIONS: process.env.GITHUB_ACTIONS,
  NO_COLOR: process.env.NO_COLOR,
  FORCE_COLOR: process.env.FORCE_COLOR,
};
delete process.env.GITHUB_ACTIONS;
delete process.env.NO_COLOR;
process.env.FORCE_COLOR = "1";
setupColors(createColors(true));
for (const [key, value] of Object.entries(maskedEnv)) {
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
}

expect.addSnapshotSerializer(plugins.ConvertAnsi as any);
