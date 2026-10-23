import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY automatically

export async function POST(req) {
  try {
    const { messages, temperature } = await req.json();
    const t = Math.min(1, Math.max(0, Number(temperature) || 0));

    const style =
      t < 0.3
        ? "Give only basic facts in 2-3 short, plain sentences."
        : t < 0.7
        ? "Give a friendly answer with a few interesting facts."
        : "Be rich, vivid and creative: surprising facts, vivid comparisons, storytelling.";

    const response = await client.messages.create({
      model: "claude-haiku-5-5",
      max_tokens: 700,
      temperature: t,
      system: `You are an animal expert chatbot. Only discuss animals; politely redirect other topics. ${style}`,
      messages: messages.slice(-10),
    });

    const reply = response.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    return Response.json({ reply });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "The chatbot had a problem. Please try again." }, { status: 500 });
  }
}
