export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { message } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-5.6-luna",
          instructions:
            "You are Cybro, a helpful personal AI assistant. " +
            "You can communicate naturally in English, Hindi, and Hinglish. " +
            "Be clear, helpful, and concise. " +
            "Never claim to have performed an action unless a connected tool actually performed it.",
          input: message
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI error:", data);

      return res.status(response.status).json({
        error: "AI request failed"
      });
    }

    return res.status(200).json({
      reply: data.output_text || "I couldn't generate a response."
    });

  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      error: "Something went wrong."
    });
  }
}
