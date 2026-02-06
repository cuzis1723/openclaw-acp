// ---------------------------------------------------------------------------
// Types (mirrors the minimal subset we need for job offerings)
// ---------------------------------------------------------------------------

import client from "./client";

export interface PriceV2 {
  type: "fixed";
  value: number;
}

export interface JobOfferingData {
  name: string;
  description: string;
  priceV2: PriceV2;
  slaMinutes: number;
  requiredFunds: boolean;
  requirement: Record<string, any>;
  deliverable: string;
}

export interface CreateJobOfferingResponse {
  success: boolean;
  /** Raw response body from the ACP API (shape may evolve). */
  data?: unknown;
}

// ---------------------------------------------------------------------------
// ACP job offerings (register / delist)
// ---------------------------------------------------------------------------

/**
 * Register a job offering on ACP by calling POST /acp/job-offerings.
 *
 * @param apiKey   - The x-api-key for authenticating with the ACP service.
 * @param offering - The job offering payload.
 */
export async function createJobOffering(
  offering: JobOfferingData
): Promise<CreateJobOfferingResponse> {
  try {
    const { data } = await client.post(`/acp/job-offerings`, {
      data: offering,
    });
    return { success: true, data };
  } catch (error: any) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`❌ ACP createJobOffering failed: ${msg}`);
    if (error?.response?.data) {
      console.error(
        `   Response body:`,
        JSON.stringify(error.response.data, null, 2)
      );
    }
    return { success: false };
  }
}

export async function deleteJobOffering(
  offeringName: string
): Promise<{ success: boolean }> {
  try {
    await client.delete(
      `/acp/job-offerings/${encodeURIComponent(offeringName)}`
    );
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`❌ ACP deleteJobOffering failed: ${msg}`);
    return { success: false };
  }
}
