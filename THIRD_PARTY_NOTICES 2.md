# Third-party notices

SignalForge does not vendor third-party source code, model weights, platform
content, or private datasets. Runtime dependencies are installed from the
lockfile and retain the licenses and notices published with their package
versions, including the vinext, Next.js, React, Drizzle, Vite, Wrangler, and
Cloudflare integration packages.

Before a release or redistribution, generate a dependency license/SBOM report
from the exact lockfile and review optional host bindings, platform APIs, fonts,
images, models, and datasets separately. This file is a maintenance policy, not
a substitute for that version-specific inventory.

Validation note (2026-08-14): `npm audit --omit=dev --audit-level=high` passes
with zero production vulnerabilities. The full development-tree audit still
reports the `vinext`/`image-size` high advisory and moderate Drizzle/esbuild
tooling advisories. Keep the development server local and resolve or explicitly
accept those toolchain findings before a hosted release.
