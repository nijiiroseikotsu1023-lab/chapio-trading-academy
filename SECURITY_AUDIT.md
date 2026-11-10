# Security audit — 2026-11-10

## Scope and findings

- Import previously accepted an almost arbitrary `state` object. This allowed excessive record counts, invalid numeric values and dangerous object keys.
- A failed `localStorage` write could leave the in-memory state changed while the persistent state remained unchanged.
- Downloaded course content already used text-only DOM rendering and same-origin URLs, but response size and course count/ID uniqueness were not bounded.
- No remote scripts, `eval`, `Function` constructor or common API-token patterns were found. Existing MIT licensing was not changed.

## Changes

- Limit progress imports to 1 MiB, 10,000 history records and 100 score records.
- Validate scalar types/ranges, key lengths, course IDs, timestamps and tiers; reject prototype-pollution keys.
- Copy accepted data into null-prototype dictionaries instead of retaining imported objects.
- Roll back in-memory state if persistence fails. Corrupt stored data is left untouched and a safe temporary state is used.
- Limit downloaded course JSON to 2 MiB and validate course count, IDs and uniqueness.
- Enforce the 2 MiB course limit while streaming response bytes, including responses without `Content-Length`.
- Run the security regression test automatically for pull requests with a read-only GitHub Actions token.

## Verification

- Browser smoke test: course start, answer submission, XP/history update, review data path, chart rendering and next-candle reveal passed.
- Static checks: no remote scripts, `eval`, `Function` constructor or common API secrets; JSON syntax and `git diff --check` passed.
- `security-tests.mjs` covers valid import, malformed values, excessive records, prototype pollution, missing/oversized `Content-Length`, and oversized streamed responses. PASS with Node.js v24.22.2 on 2026-11-10.

## Residual risks

- Browser file-chooser automation remains manual; validation and streaming boundary cases are covered at the function level.
- The same-origin content update is not cryptographically signed; repository/hosting compromise could replace course content within the enforced schema.
- The single-file app uses inline JavaScript, so a strict nonce/hash-based CSP would require a larger packaging change.
- Existing MIT grants permit redistribution of versions already distributed under MIT. Any future license or access change requires owner and legal review.

## Suggested GitHub settings (not applied)

- Protect `main`: require pull requests, one approval, passing checks and blocked force-push/deletion.
- Enable secret scanning/push protection, Dependabot alerts and CodeQL if available for this repository.
- Add a Pages deployment environment with required reviewer approval if publication should be controlled.
