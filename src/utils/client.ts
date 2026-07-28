import { createDeliveryClient } from "@kontent-ai/delivery-sdk";
import { CoreClientTypes } from "../model";

// Preview vs published is selected per deployment via VITE_KONTENT_PREVIEW. The SDK derives the
// correct base URL from usePreviewMode: preview-deliver.kontent.ai when true, deliver.kontent.ai
// (published content) when false. Preview requires the preview API key; published content is
// public unless secure access is enabled, in which case the same slot carries the secure key.
const isPreview = import.meta.env.VITE_KONTENT_PREVIEW === "true";

export const createClient = (environmentId: string, apiKey?: string) =>
  createDeliveryClient<CoreClientTypes>({
    environmentId,
    ...(isPreview
      ? { previewApiKey: apiKey }
      : apiKey
        ? { secureApiKey: apiKey }
        : {}),
    defaultQueryConfig: {
      usePreviewMode: isPreview,
    },
  });
