/* `npm run verify`, second half: check the site in this folder. Exits non-zero on any
   problem. Screenshots go to .verify/ (git-ignored) for a human look. */
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { checkSite } from './check-site.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const screenshotDir = join(root, '.verify');
mkdirSync(screenshotDir, { recursive: true });

const problems = await checkSite(root, { screenshotDir });
if (problems.length) {
  console.error(`Site check failed, ${problems.length} problem(s):\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(`Site check passed (screenshots in .verify/).`);
