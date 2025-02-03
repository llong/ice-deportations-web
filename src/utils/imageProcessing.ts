import { DeportationData } from "../types";
import { processImage as processImageFromAPI } from "../services/api"; // Rename the import

export async function processImage(
  imageUrl: string
): Promise<Partial<DeportationData>> {
  try {
    const extractedData = await processImageFromAPI(imageUrl); // Use the renamed import
    if (extractedData) {
      return {
        arrests: extractedData.arrests,
        detainers: extractedData.detainers,
      };
    }
    return {
      arrests: 0,
      detainers: 0,
    };
  } catch (error) {
    console.error("Error processing image:", error);
    return {
      arrests: 0,
      detainers: 0,
    };
  }
}
