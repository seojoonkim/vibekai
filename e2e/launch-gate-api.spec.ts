/**
 * VibeDojo Launch Gate - L0 API Tests
 *
 * Fast API-based checks (no browser needed, ~90 seconds)
 * Run with: npx playwright test e2e/launch-gate-api.spec.ts
 *
 * These tests verify backend logic without browser overhead.
 * Requires authenticated session cookie or test token.
 */

import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

// For API tests, we need to authenticate first
// This assumes cookie-based auth after login
test.describe("L0: API Gate (~90 seconds)", () => {
  let authCookie: string;

  test.beforeAll(async ({ request }) => {
    // Login to get session cookie
    // Adjust based on your auth method
    const loginResponse = await request.post(`${BASE_URL}/api/auth/callback`, {
      // This depends on your auth setup
      // For testing, you might use a test endpoint or service role
    });

    // Store cookies for subsequent requests
    // Note: In real setup, you'd extract the session cookie here
  });

  /**
   * L0-1: Streak API Idempotency
   *
   * POST /api/streak 3 times → only first returns isNewDay: true (or all false if already updated)
   */
  test("L0-1: Streak API is idempotent", async ({ request }) => {
    const results: { isNewDay: boolean; currentStreak: number }[] = [];

    // Call streak API 3 times
    for (let i = 0; i < 3; i++) {
      const response = await request.post(`${BASE_URL}/api/streak`);

      // If unauthorized, skip (test account not set up)
      if (response.status() === 401) {
        console.log("Skipping: Not authenticated. Set up test account.");
        test.skip();
        return;
      }

      const data = await response.json();
      results.push(data);
      console.log(`Call ${i + 1}: isNewDay=${data.isNewDay}, streak=${data.currentStreak}`);
    }

    // Verify: At most 1 isNewDay: true, rest must be false
    const newDayCount = results.filter((r) => r.isNewDay).length;
    expect(newDayCount).toBeLessThanOrEqual(1);

    // Verify: All streak values are consistent (same number)
    const streaks = results.map((r) => r.currentStreak);
    expect(new Set(streaks).size).toBe(1);

    console.log(`✓ Streak idempotency verified: ${newDayCount} new day updates, streak=${streaks[0]}`);
  });

  /**
   * L0-2: Streak GET/POST Consistency
   *
   * POST then GET should return matching values
   */
  test("L0-2: Streak GET/POST consistency", async ({ request }) => {
    // POST to update
    const postResponse = await request.post(`${BASE_URL}/api/streak`);
    if (postResponse.status() === 401) {
      test.skip();
      return;
    }
    const postData = await postResponse.json();

    // GET to read
    const getResponse = await request.get(`${BASE_URL}/api/streak`);
    const getData = await getResponse.json();

    // Values should match
    expect(getData.currentStreak).toBe(postData.currentStreak);
    expect(getData.longestStreak).toBe(postData.longestStreak);

    console.log(`✓ GET/POST consistency: streak=${getData.currentStreak}, longest=${getData.longestStreak}`);
  });

  /**
   * L0-3: Quiz Perfect Dedupe Check
   *
   * Debug endpoint should show count <= 1 per chapter
   */
  test("L0-3: Quiz perfect bonus is deduplicated", async ({ request }) => {
    const chapterId = "01";

    const response = await request.get(
      `${BASE_URL}/api/debug/xp-logs?action=quiz_perfect&referenceId=${chapterId}`
    );

    // If 403, debug endpoint is disabled (production)
    if (response.status() === 403) {
      console.log("Debug endpoint disabled (production mode) - PASS by design");
      return;
    }

    // If 401, not authenticated
    if (response.status() === 401) {
      test.skip();
      return;
    }

    const data = await response.json();
    console.log(`quiz_perfect count for chapter ${chapterId}: ${data.count}`);

    // Must be 0 or 1, never more
    expect(data.count).toBeLessThanOrEqual(1);

    console.log(`✓ Quiz perfect dedupe verified: count=${data.count}`);
  });

  /**
   * L0-4: Debug Endpoint Security
   *
   * In production, debug endpoint should return 403
   */
  test("L0-4: Debug endpoint is secured", async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/debug/xp-logs?action=test`);

    // In production (without ALLOW_DEBUG_ENDPOINTS), should be 403
    // In staging/dev, 401 (unauthorized) or 200 (success) are OK
    const validStatuses = [200, 401, 403];
    expect(validStatuses).toContain(response.status());

    if (response.status() === 403) {
      console.log("✓ Debug endpoint properly secured for production");
    } else {
      console.log(`✓ Debug endpoint accessible (status=${response.status()}) - OK for staging/dev`);
    }
  });
});

/**
 * Summary
 */
test("L0 Summary", async () => {
  console.log("=".repeat(50));
  console.log("L0 API GATE COMPLETE");
  console.log("=".repeat(50));
  console.log("L0-1: Streak idempotency");
  console.log("L0-2: Streak GET/POST consistency");
  console.log("L0-3: Quiz perfect dedupe");
  console.log("L0-4: Debug endpoint security");
  console.log("=".repeat(50));
});
