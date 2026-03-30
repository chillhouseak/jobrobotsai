export default async function handler(req, res) {
  try {
    // ✅ CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const { prompt } = body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    // ✅ Generate Pollinations image URL
    const encodedPrompt = encodeURIComponent(prompt);

    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;

    return res.status(200).json({
      success: true,
      image: imageUrl,
    });

  } catch (error) {
    console.error("Image API Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
