import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const enhanceImageWithGemini = async (base64ImageData: string, resolution: string): Promise<string> => {
    try {
        const [header, base64Data] = base64ImageData.split(',');
        if (!header || !base64Data) {
            throw new Error('Invalid base64 image data format.');
        }

        const mimeTypeMatch = header.match(/:(.*?);/);
        if (!mimeTypeMatch || !mimeTypeMatch[1]) {
            throw new Error('Could not extract MIME type from base64 data.');
        }
        const mimeType = mimeTypeMatch[1];

        const prompt = `Enhance this low-quality photo to a high-quality, crisp ${resolution} image. Improve details, sharpness, and color vibrancy without altering the original composition or subject matter.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Data,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        const firstPart = response.candidates?.[0]?.content?.parts?.[0];

        if (firstPart && firstPart.inlineData) {
            const enhancedBase64 = firstPart.inlineData.data;
            const enhancedMimeType = firstPart.inlineData.mimeType;
            return `data:${enhancedMimeType};base64,${enhancedBase64}`;
        } else {
            throw new Error('No image data found in the API response.');
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error('Failed to process image with the AI model. The model may have refused to process this image.');
    }
};