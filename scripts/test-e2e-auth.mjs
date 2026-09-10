import { generateSync } from "../../macho-halisi-backend/node_modules/otplib/dist/index.js";

const FRONTEND_URL = "http://localhost:3000";
const ADMIN_MFA_SECRET = "LBNRXQKAZZVMVMH27D6AW7EDBFWMZ523";

let cookieJar = new Map();

function updateCookiesFromHeaders(headers) {
  const setCookies = typeof headers.getSetCookie === "function" 
    ? headers.getSetCookie() 
    : (headers.get("set-cookie") ? [headers.get("set-cookie")] : []);

  for (const cookieStr of setCookies) {
    const parts = cookieStr.split(";")[0].trim();
    const [name, val] = parts.split("=");
    if (cookieStr.includes("Max-Age=0")) {
      cookieJar.delete(name);
    } else {
      cookieJar.set(name, val);
    }
  }
}

function getCookieHeader() {
  return Array.from(cookieJar.entries())
    .map(([name, val]) => `${name}=${val}`)
    .join("; ");
}

async function runTests() {
  console.log("🚀 Starting End-to-End Dashboard & Auth Proxy Verification Suite\n");
  let passed = 0;
  let total = 0;

  function assert(condition, message, details = "") {
    total++;
    if (condition) {
      passed++;
      console.log(`✅ [TEST ${total}] PASS: ${message}`);
      if (details) console.log(`   ${details}`);
    } else {
      console.error(`❌ [TEST ${total}] FAIL: ${message}`);
      if (details) console.error(`   ${details}`);
    }
  }

  // 1. Unauthenticated direct visit to /dashboard -> Redirects to /dashboard/login
  console.log("--- Scenario 1: Unauthenticated Route Protection ---");
  const res1 = await fetch(`${FRONTEND_URL}/dashboard`, {
    redirect: "manual",
  });
  const location1 = res1.headers.get("location") || "";
  assert(
    res1.status === 307 && location1.includes("/dashboard/login"),
    "Unauthenticated GET /dashboard redirects (307) to /dashboard/login",
    `Status: ${res1.status}, Location: ${location1}`
  );

  // 2. Bad credentials login -> 401
  console.log("\n--- Scenario 2: Invalid Credentials Handling ---");
  const res2 = await fetch(`${FRONTEND_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@machohalisi.com", password: "WrongPassword" }),
  });
  const data2 = await res2.json();
  assert(
    res2.status === 401 && data2.status === "error",
    "Invalid password returns 401 with error message",
    `Status: ${res2.status}, Message: "${data2.message}"`
  );

  // 3. Admin login -> mfa_required
  console.log("\n--- Scenario 3: Admin Credential Verification & MFA Required ---");
  const res3 = await fetch(`${FRONTEND_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@machohalisi.com", password: "AdminPassword123!" }),
  });
  const data3 = await res3.json();
  const challengeToken = data3.challengeToken;
  assert(
    res3.status === 200 && data3.status === "mfa_required" && typeof challengeToken === "string",
    "Enrolled Admin login returns mfa_required with challengeToken",
    `Status: ${data3.status}, ChallengeToken Length: ${challengeToken?.length}`
  );

  // 4. MFA verify with wrong TOTP code -> 400
  console.log("\n--- Scenario 4: MFA Code Validation ---");
  const res4 = await fetch(`${FRONTEND_URL}/api/auth/mfa/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ challengeToken, code: "000000" }),
  });
  const data4 = await res4.json();
  assert(
    res4.status === 400 && data4.status === "error",
    "Invalid TOTP code is rejected with 400 Bad Request",
    `Status: ${res4.status}, Message: "${data4.message}"`
  );

  // 5. MFA verify with valid TOTP code -> 200 + sets httpOnly cookies
  console.log("\n--- Scenario 5: MFA Verification & httpOnly Cookie Issuance ---");
  const validTotp = generateSync({ secret: ADMIN_MFA_SECRET });
  const res5 = await fetch(`${FRONTEND_URL}/api/auth/mfa/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ challengeToken, code: validTotp }),
  });
  updateCookiesFromHeaders(res5.headers);
  const data5 = await res5.json();
  const rawSetCookies = typeof res5.headers.getSetCookie === "function" 
    ? res5.headers.getSetCookie() 
    : [res5.headers.get("set-cookie") || ""];

  const hasHttpOnlyAccessToken = rawSetCookies.some(c => c.includes("mh_access_token") && c.includes("HttpOnly"));
  const hasHttpOnlyRefreshToken = rawSetCookies.some(c => c.includes("mh_refresh_token") && c.includes("HttpOnly"));
  const tokensNotInBody = data5.accessToken === undefined && data5.refreshToken === undefined;

  assert(
    res5.status === 200 && data5.status === "ok" && hasHttpOnlyAccessToken && hasHttpOnlyRefreshToken && tokensNotInBody,
    "Valid TOTP verifies successfully; issues httpOnly cookies without leaking tokens in JSON body",
    `Cookies in Jar: ${Array.from(cookieJar.keys()).join(", ")}, Tokens in body: ${!tokensNotInBody}`
  );

  // 6. Access /api/auth/me with session cookies -> returns user details
  console.log("\n--- Scenario 6: Session Hydration (/api/auth/me) ---");
  const res6 = await fetch(`${FRONTEND_URL}/api/auth/me`, {
    headers: { Cookie: getCookieHeader() },
  });
  const data6 = await res6.json();
  assert(
    res6.status === 200 && data6.status === "ok" && data6.user?.email === "admin@machohalisi.com" && data6.user?.role === "ADMIN",
    "GET /api/auth/me returns authenticated Admin user details",
    `User: ${data6.user?.email}, Role: ${data6.user?.role}, ID: ${data6.user?.id}`
  );

  // 7. Access /dashboard with session cookies -> 200 OK
  console.log("\n--- Scenario 7: Authenticated Route Access ---");
  const res7 = await fetch(`${FRONTEND_URL}/dashboard`, {
    headers: { Cookie: getCookieHeader() },
    redirect: "manual",
  });
  assert(
    res7.status === 200,
    "Authenticated GET /dashboard succeeds (200 OK, no redirect)",
    `Status: ${res7.status}`
  );

  // 8. Access /dashboard/login while authenticated -> Redirects to /dashboard
  console.log("\n--- Scenario 8: Authenticated User Accessing Login ---");
  const res8 = await fetch(`${FRONTEND_URL}/dashboard/login`, {
    headers: { Cookie: getCookieHeader() },
    redirect: "manual",
  });
  const location8 = res8.headers.get("location") || "";
  assert(
    res8.status === 307 && location8.endsWith("/dashboard"),
    "Already-authenticated user visiting /dashboard/login is redirected (307) to /dashboard",
    `Status: ${res8.status}, Location: ${location8}`
  );

  // 9. Refresh token rotation (/api/auth/refresh)
  console.log("\n--- Scenario 9: Token Refreshing ---");
  const res9 = await fetch(`${FRONTEND_URL}/api/auth/refresh`, {
    method: "POST",
    headers: { Cookie: getCookieHeader() },
  });
  updateCookiesFromHeaders(res9.headers);
  const data9 = await res9.json();
  assert(
    res9.status === 200 && data9.status === "ok" && cookieJar.has("mh_access_token"),
    "POST /api/auth/refresh succeeds and sets new access token cookie",
    `Status: ${res9.status}, Access Token present: ${cookieJar.has("mh_access_token")}`
  );

  // 10. Logout (/api/auth/logout)
  console.log("\n--- Scenario 10: Logout & Session Teardown ---");
  const res10 = await fetch(`${FRONTEND_URL}/api/auth/logout`, {
    method: "POST",
    headers: { Cookie: getCookieHeader() },
  });
  updateCookiesFromHeaders(res10.headers);
  const data10 = await res10.json();
  const cookiesCleared = !cookieJar.has("mh_access_token") && !cookieJar.has("mh_refresh_token");
  assert(
    res10.status === 200 && data10.status === "ok" && cookiesCleared,
    "POST /api/auth/logout clears auth cookies from jar",
    `Cookies in Jar: ${Array.from(cookieJar.keys()).length === 0 ? "EMPTY" : Array.from(cookieJar.keys()).join(", ")}`
  );

  // 11. Post-logout /dashboard -> Redirects to /dashboard/login
  console.log("\n--- Scenario 11: Post-Logout Route Protection ---");
  const res11 = await fetch(`${FRONTEND_URL}/dashboard`, {
    headers: { Cookie: getCookieHeader() },
    redirect: "manual",
  });
  const location11 = res11.headers.get("location") || "";
  assert(
    res11.status === 307 && location11.includes("/dashboard/login"),
    "GET /dashboard after logout redirects to /dashboard/login",
    `Status: ${res11.status}, Location: ${location11}`
  );

  // 12. Post-logout /api/auth/me -> 401 Unauthorized
  console.log("\n--- Scenario 12: Post-Logout API Protection ---");
  const res12 = await fetch(`${FRONTEND_URL}/api/auth/me`, {
    headers: { Cookie: getCookieHeader() },
  });
  assert(
    res12.status === 401,
    "GET /api/auth/me after logout returns 401 Unauthorized",
    `Status: ${res12.status}`
  );

  // 13. Editor user login -> mfa_enrollment_required
  console.log("\n--- Scenario 13: MFA Enrollment Trigger for Unenrolled Editor ---");
  const res13 = await fetch(`${FRONTEND_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "editor@machohalisi.com", password: "EditorPassword123!" }),
  });
  const data13 = await res13.json();
  const editorChallengeToken = data13.challengeToken;
  assert(
    res13.status === 200 && data13.status === "mfa_enrollment_required" && typeof editorChallengeToken === "string",
    "Unenrolled Editor login returns mfa_enrollment_required",
    `Status: ${data13.status}, ChallengeToken present: ${Boolean(editorChallengeToken)}`
  );

  // 14. MFA Enroll endpoint returns secret and QR code data URL
  console.log("\n--- Scenario 14: MFA Enrollment Data Generation ---");
  const res14 = await fetch(`${FRONTEND_URL}/api/auth/mfa/enroll`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${editorChallengeToken}`,
    },
    body: JSON.stringify({ challengeToken: editorChallengeToken }),
  });
  const data14 = await res14.json();
  assert(
    res14.status === 200 && data14.status === "ok" && typeof data14.secret === "string" && data14.qrCodeDataUrl?.startsWith("data:image/png;base64,"),
    "POST /api/auth/mfa/enroll returns secret and QR code base64 data URL",
    `Secret length: ${data14.secret?.length}, QR code format valid: ${data14.qrCodeDataUrl?.startsWith("data:image/png;base64,")}`
  );

  // Summary
  console.log("\n==================================================");
  console.log(`SUMMARY: ${passed}/${total} TESTS PASSED`);
  console.log("==================================================\n");

  if (passed === total) {
    console.log("🎉 ALL E2E AUTH & DASHBOARD INTEGRATION TESTS PASSED!\n");
    process.exit(0);
  } else {
    console.error("🚨 SOME TESTS FAILED!\n");
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error("Fatal test runner error:", err);
  process.exit(1);
});
