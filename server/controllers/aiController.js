const { GoogleGenerativeAI } = require("@google/generative-ai");

const generateTaskBreakdown = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Fix: systemInstruction goes here in the model config, not in systemPrompt string format
    const model = genAI.getGenerativeModel({
      model: "	gemini-2.5-flash",
      systemInstruction:
        "You are a helpful project management assistant. You take a brief task title or description, and break it down into a clear, actionable list of subtasks. Format the response as a simple markdown bulleted or numbered list. No extra conversational filler.",
    });

    const result = await model.generateContent(`Task: ${prompt}`);
    const text = result.response.text();

    res.json({ result: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to generate task breakdown",
      error: error.message,
    });
  }
};

const chatWithAI = async (req, res) => {
  try {
    const { message, previousMessages = [] } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Fix: systemInstruction goes here in the model config for `@google/generative-ai` >= 0.7.0
    const model = genAI.getGenerativeModel({
      model: "	gemini-2.5-flash",
      systemInstruction:
        "You are TaskFlow AI, an intelligent assistant built into a project management SaaS tool. Help the user prioritize tasks, summarize progress, brainstorm ideas, and manage their workload.",
    });

    // Fix: robust history parser ensuring strictly alternating 'user'/'model' starting with 'user'
    const history = [];

    for (const msg of previousMessages) {
      const msgRole = msg.role === "ai" ? "model" : "user";

      // Rule 1: History must strictly start with 'user'
      if (history.length === 0 && msgRole !== "user") {
        continue; // Skip initial model messages
      }

      // Rule 2: Consecutive messages from the same role must be merged (alternation rule)
      if (history.length > 0 && history[history.length - 1].role === msgRole) {
        history[history.length - 1].parts[0].text += `\n\n${msg.content}`;
      } else {
        history.push({
          role: msgRole,
          parts: [{ text: msg.content }],
        });
      }
    }

    const chat = model.startChat({ history });

    const result = await chat.sendMessage(message);
    const text = result.response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Chat generation failed", error: error.message });
  }
};

module.exports = { generateTaskBreakdown, chatWithAI };
