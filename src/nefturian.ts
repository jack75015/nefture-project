import { MetadataType, MetadataUpdated } from "./types";
import axios from "axios";
import * as crypto from "crypto";

async function getNefturianMetadataAPI(
  index: number,
  apiMetadata: string
): Promise<MetadataType | null> {
  const url = `${apiMetadata}/${index}`;
  try {
    const response = await axios.get(url);
    const { data } = response;
    return data;
  } catch (error) {
    console.error(
      `Error while getting Nefturian metadata for index ${index}:`,
      error
    );
    return null;
  }
}

export async function getNefturianMetadata(
  index: number,
  apiMetadataUrl: string
): Promise<MetadataUpdated | null> {
  const metadata = await getNefturianMetadataAPI(index, apiMetadataUrl);
  if (!metadata || !metadata?.name) {
    return null;
  }
  const isRevealed = metadata.attributes.length > 0;
  return { metadata, isRevealed };
}

export const generateUniqueId = (ethereumAddress: string): string => {
  const hash = crypto.createHash("sha256");
  hash.update(ethereumAddress);
  return hash.digest("hex");
};
