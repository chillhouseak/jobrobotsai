import { useState } from "react";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt) return;

    try {
      setLoading(true);

      const res = await fetch(
        "https://jobrobotsaii.vercel.app/api/ai/image",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setImage(data.image);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>AI Image Generator 🎨</h2>

      <input
        type="text"
        placeholder="Enter prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ padding: "10px", width: "300px" }}
      />

      <button
        onClick={generateImage}
        style={{ marginLeft: "10px", padding: "10px" }}
      >
        Generate
      </button>

      {loading && <p>Generating...</p>}

      {image && (
        <div style={{ marginTop: "20px" }}>
          <img
            src={image}
            alt="AI"
            style={{ width: "300px", borderRadius: "10px" }}
          />
        </div>
      )}
    </div>
  );
}
