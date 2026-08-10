import assert from "node:assert/strict";
import test from "node:test";
import { getSiteUserFromHeaders } from "../app/auth-headers.ts";

test("requires both stable user id and email", () => {
  assert.equal(
    getSiteUserFromHeaders(new Headers({ "oai-authenticated-user-email": "person@example.com" })),
    null,
  );
});

test("decodes an optional verified display name", () => {
  assert.deepEqual(
    getSiteUserFromHeaders(new Headers({
      "oai-authenticated-user-id": "user-123",
      "oai-authenticated-user-email": "person@example.com",
      "oai-authenticated-user-full-name": "Asha%20Singh",
      "oai-authenticated-user-full-name-encoding": "percent-encoded-utf-8",
    })),
    {
      id: "user-123",
      email: "person@example.com",
      fullName: "Asha Singh",
      displayName: "Asha Singh",
    },
  );
});

test("does not decode a name without the declared encoding", () => {
  assert.deepEqual(
    getSiteUserFromHeaders(new Headers({
      "oai-authenticated-user-id": "user-123",
      "oai-authenticated-user-email": "person@example.com",
      "oai-authenticated-user-full-name": "Untrusted%20Name",
    })),
    {
      id: "user-123",
      email: "person@example.com",
      fullName: null,
      displayName: "person@example.com",
    },
  );
});
