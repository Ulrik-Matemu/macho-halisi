import { generateSync } from "../../macho-halisi-backend/node_modules/otplib/dist/index.js";
import { PrismaClient } from "../../macho-halisi-backend/node_modules/@prisma/client/index.js";

const FRONTEND_URL = "http://localhost:3000";

let cookieJar = new Map();

function updateCookiesFromHeaders(headers) {
  const setCookies =
    typeof headers.getSetCookie === "function"
      ? headers.getSetCookie()
      : headers.get("set-cookie")
      ? [headers.get("set-cookie")]
      : [];

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
  console.log("🚀 Starting End-to-End Itinerary Management & Proxy Verification Suite\n");
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

  // 1. Fetch current admin MFA secret directly from DB
  const prisma = new PrismaClient();
  const adminUser = await prisma.user.findUnique({
    where: { email: "admin@machohalisi.com" },
  });
  const adminMfaSecret = adminUser?.mfaSecret || "3LN2REVO6STDI5PNYAV5BQEQVYO4JEQ2";
  await prisma.$disconnect();

  // 1. Authenticate Admin
  console.log("--- Phase 1: Authentication & Session Setup ---");
  const loginRes = await fetch(`${FRONTEND_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@machohalisi.com", password: "AdminPassword123!" }),
  });
  const loginData = await loginRes.json();
  const challengeToken = loginData.challengeToken;

  const validTotp = generateSync({ secret: adminMfaSecret });
  const verifyRes = await fetch(`${FRONTEND_URL}/api/auth/mfa/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ challengeToken, code: validTotp }),
  });
  updateCookiesFromHeaders(verifyRes.headers);

  const meRes = await fetch(`${FRONTEND_URL}/api/auth/me`, {
    headers: { Cookie: getCookieHeader() },
  });
  const meData = await meRes.json();
  assert(
    meRes.status === 200 && meData.user?.role === "ADMIN",
    "Admin session verified via httpOnly cookie",
    `User: ${meData.user?.email} (${meData.user?.role})`
  );

  // 2. Destinations API
  console.log("\n--- Phase 2: Destinations Proxy API ---");
  const destName = `Serengeti E2E ${Date.now().toString().slice(-4)}`;
  const createDestRes = await fetch(`${FRONTEND_URL}/api/destinations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: getCookieHeader(),
    },
    body: JSON.stringify({ name: destName }),
  });
  const createDestData = await createDestRes.json();
  const destinationId = createDestData.destination?.id;
  assert(
    createDestRes.status === 201 && !!destinationId,
    `POST /api/destinations creates new destination (${destName})`,
    `ID: ${destinationId}, Slug: ${createDestData.destination?.slug}`
  );

  const listDestRes = await fetch(`${FRONTEND_URL}/api/destinations`, {
    headers: { Cookie: getCookieHeader() },
  });
  const listDestData = await listDestRes.json();
  const destinationsList = listDestData.data || listDestData.destinations || [];
  const foundDest = destinationsList.some((d) => d.id === destinationId);
  assert(
    listDestRes.status === 200 && foundDest,
    "GET /api/destinations returns newly created destination in list",
    `Total Destinations: ${destinationsList.length}`
  );

  // 3. Itinerary Creation (Draft Setup)
  console.log("\n--- Phase 3: Itinerary Creation (Minimal Draft) ---");
  const createItinRes = await fetch(`${FRONTEND_URL}/api/itineraries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: getCookieHeader(),
    },
    body: JSON.stringify({
      title: "E2E 7-Day Great Migration Safari",
      nights: 6,
      priceOnRequest: false,
      startingPrice: 5800,
      days: [],
      destinationIds: [],
      images: [],
    }),
  });
  const createItinData = await createItinRes.json();
  const itineraryId = createItinData.itinerary?.id;
  assert(
    createItinRes.status === 201 && createItinData.itinerary?.status === "DRAFT",
    "POST /api/itineraries creates new DRAFT itinerary with initial pricing",
    `Itinerary ID: ${itineraryId}, Slug: ${createItinData.itinerary?.slug}`
  );

  // 4. Autosave (PUT /api/itineraries/:id)
  console.log("\n--- Phase 4: Autosave Engine Simulation (PUT /api/itineraries/:id) ---");
  const updatePayload = {
    title: "E2E 7-Day Great Migration & Mara River Safari",
    overview: "An extraordinary journey tracking vast herds across the endless plains.",
    nights: 6,
    priceOnRequest: false,
    startingPrice: 5950,
    availabilityStatus: "AVAILABLE",
    days: [
      {
        dayNumber: 1,
        title: "Arusha to Tarangire Elephant Sanctuary",
        description: "Game drive past ancient baobabs and massive elephant herds.",
        accommodation: "Sanctuary Swala Camp",
        activities: ["Game Drive", "Bird Watching"],
      },
      {
        dayNumber: 2,
        title: "Central Serengeti Golden Plains",
        description: "Witness apex predators roaming the Seronera river valley.",
        accommodation: "Four Seasons Safari Lodge",
        activities: ["Morning Game Drive", "Sunset Drinks"],
      },
    ],
    destinationIds: [destinationId],
    inclusions: ["All 4x4 safari drives", "Park fees", "Full board accommodation"],
    exclusions: ["International flights", "Travel insurance", "Gratuities"],
    travelInfo: "Valid yellow fever vaccination certificate required at Kilimanjaro Airport.",
    routeMapUrl: "https://maps.google.com/?q=serengeti",
  };

  const updateRes = await fetch(`${FRONTEND_URL}/api/itineraries/${itineraryId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: getCookieHeader(),
    },
    body: JSON.stringify(updatePayload),
  });
  const updateData = await updateRes.json();
  assert(
    updateRes.status === 200 &&
      updateData.itinerary?.days?.length === 2 &&
      updateData.itinerary?.destinations?.length === 1,
    "PUT /api/itineraries/:id saves full itinerary details, 2 days, and linked destination",
    `Days Saved: ${updateData.itinerary?.days?.length}, Destinations: ${updateData.itinerary?.destinations?.length}`
  );

  // 5. Gallery Image Upload & Attachment
  console.log("\n--- Phase 5: Image Upload to Cloudinary & Gallery Attachment ---");
  const tinyPngBase64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  const pngBuffer = Buffer.from(tinyPngBase64, "base64");
  const blob = new Blob([pngBuffer], { type: "image/png" });
  const formData = new FormData();
  formData.append("image", blob, "test-safari-image.png");

  const uploadRes = await fetch(`${FRONTEND_URL}/api/uploads/image`, {
    method: "POST",
    headers: { Cookie: getCookieHeader() },
    body: formData,
  });
  const uploadData = await uploadRes.json();
  const uploadedUrl = uploadData.url;
  const cloudinaryPublicId = uploadData.publicId;

  assert(
    uploadRes.status === 201 && typeof uploadedUrl === "string" && uploadedUrl.includes("res.cloudinary.com"),
    "POST /api/uploads/image successfully streams multipart image to Cloudinary",
    `URL: ${uploadedUrl?.slice(0, 50)}... PublicId: ${cloudinaryPublicId}`
  );

  // Attach uploaded image to itinerary gallery
  const attachRes = await fetch(`${FRONTEND_URL}/api/itineraries/${itineraryId}/images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: getCookieHeader(),
    },
    body: JSON.stringify({
      url: uploadedUrl,
      cloudinaryPublicId,
      sortOrder: 0,
      altText: "Cheetah on lookout in the Serengeti",
    }),
  });
  const attachData = await attachRes.json();
  const imageId = attachData.image?.id;
  assert(
    attachRes.status === 201 && !!imageId,
    "POST /api/itineraries/:id/images links Cloudinary asset to itinerary gallery",
    `Image ID: ${imageId}, Sort Order: ${attachData.image?.sortOrder}`
  );

  // 6. Fetch Full Itinerary Detail
  console.log("\n--- Phase 6: Verify Full Itinerary Dossier ---");
  const detailRes = await fetch(`${FRONTEND_URL}/api/itineraries/${itineraryId}`, {
    headers: { Cookie: getCookieHeader() },
  });
  const detailData = await detailRes.json();
  const itin = detailData.itinerary;
  assert(
    detailRes.status === 200 &&
      itin?.days?.length === 2 &&
      itin?.images?.length === 1 &&
      itin?.destinations?.length === 1 &&
      itin?.inclusions?.length === 3,
    "GET /api/itineraries/:id hydrates complete nested tree (days, images, destinations, tags)",
    `Title: "${itin?.title}", Status: ${itin?.status}, Days: ${itin?.days?.length}, Images: ${itin?.images?.length}`
  );

  // 7. Publish Validation Guard (Must have >= 1 day)
  console.log("\n--- Phase 7: Publish Validation Guard ---");
  // Create an empty draft with 0 days
  const emptyItinRes = await fetch(`${FRONTEND_URL}/api/itineraries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: getCookieHeader(),
    },
    body: JSON.stringify({
      title: "Incomplete Safari with 0 Days",
      priceOnRequest: true,
      days: [],
    }),
  });
  const emptyItinData = await emptyItinRes.json();
  const emptyItinId = emptyItinData.itinerary?.id;

  const badPublishRes = await fetch(`${FRONTEND_URL}/api/itineraries/${emptyItinId}/publish`, {
    method: "PATCH",
    headers: { Cookie: getCookieHeader() },
  });
  const badPublishData = await badPublishRes.json();
  assert(
    badPublishRes.status === 400 && badPublishData.message?.includes("at least one day"),
    "PATCH /api/itineraries/:id/publish rejects draft with 0 days (400 Bad Request)",
    `Message: "${badPublishData.message}"`
  );

  // Clean up empty draft
  await fetch(`${FRONTEND_URL}/api/itineraries/${emptyItinId}`, {
    method: "DELETE",
    headers: { Cookie: getCookieHeader() },
  });

  // 8. Admin Publish
  console.log("\n--- Phase 8: Admin Publish Action ---");
  const publishRes = await fetch(`${FRONTEND_URL}/api/itineraries/${itineraryId}/publish`, {
    method: "PATCH",
    headers: { Cookie: getCookieHeader() },
  });
  const publishData = await publishRes.json();
  assert(
    publishRes.status === 200 && publishData.itinerary?.status === "PUBLISHED",
    "PATCH /api/itineraries/:id/publish transitions status to PUBLISHED",
    `Status: ${publishData.itinerary?.status}, PublishedAt: ${publishData.itinerary?.publishedAt}`
  );

  // 9. Admin Archive
  console.log("\n--- Phase 9: Admin Archive Action ---");
  const archiveRes = await fetch(`${FRONTEND_URL}/api/itineraries/${itineraryId}/archive`, {
    method: "PATCH",
    headers: { Cookie: getCookieHeader() },
  });
  const archiveData = await archiveRes.json();
  assert(
    archiveRes.status === 200 && archiveData.itinerary?.status === "ARCHIVED",
    "PATCH /api/itineraries/:id/archive transitions status to ARCHIVED",
    `Status: ${archiveData.itinerary?.status}`
  );

  // 10. List Itineraries with Filters
  console.log("\n--- Phase 10: Itinerary List View & Status Filtering ---");
  const listAllRes = await fetch(`${FRONTEND_URL}/api/itineraries`, {
    headers: { Cookie: getCookieHeader() },
  });
  const listAllData = await listAllRes.json();
  const listArchivedRes = await fetch(`${FRONTEND_URL}/api/itineraries?status=ARCHIVED`, {
    headers: { Cookie: getCookieHeader() },
  });
  const listArchivedData = await listArchivedRes.json();

  assert(
    listAllRes.status === 200 &&
      listArchivedRes.status === 200 &&
      listArchivedData.data?.some((i) => i.id === itineraryId),
    "GET /api/itineraries?status=ARCHIVED returns filtered archived results",
    `Total: ${listAllData.pagination?.total}, Archived Total: ${listArchivedData.pagination?.total}`
  );

  // 11. Cleanup (Delete Image & Delete Itinerary)
  console.log("\n--- Phase 11: Cleanup Deletions ---");
  const delImageRes = await fetch(`${FRONTEND_URL}/api/itineraries/${itineraryId}/images/${imageId}`, {
    method: "DELETE",
    headers: { Cookie: getCookieHeader() },
  });
  const delImageData = await delImageRes.json();
  assert(
    delImageRes.status === 200 && delImageData.status === "ok",
    "DELETE /api/itineraries/:id/images/:imageId removes image from gallery and Cloudinary",
    `Message: "${delImageData.message}"`
  );

  const delItinRes = await fetch(`${FRONTEND_URL}/api/itineraries/${itineraryId}`, {
    method: "DELETE",
    headers: { Cookie: getCookieHeader() },
  });
  const delItinData = await delItinRes.json();
  assert(
    delItinRes.status === 200 && delItinData.status === "ok",
    "DELETE /api/itineraries/:id permanently deletes itinerary",
    `Message: "${delItinData.message}"`
  );

  console.log("\n========================================================");
  console.log(`📊 Verification Summary: ${passed} / ${total} Tests Passed`);
  console.log("========================================================\n");

  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution threw fatal error:", err);
  process.exit(1);
});
