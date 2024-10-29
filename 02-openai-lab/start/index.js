import dotenv from 'dotenv'
import OpenAI from "openai"

dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})


async function jobInterview(role) {
  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: `Generate 3 interview questions for a ${role}.` },
      ],
      stream: true,
    })

    handleAsyncIterable(
      stream,
      (chunk) => {
        const content = chunk.choices[0]?.delta?.content || ''
        process.stdout.write(content)
      },
      () => console.log("\nStream ended."),
      (error) => console.error("Error in stream:", error.message)
    )

  } catch (error) {
    console.error("Error generating interview questions:", error.message)
  }
}

jobInterview("React developer")

// Helper function to simulate 'on' events for async iterable
async function handleAsyncIterable(iterable, onData, onEnd, onError) {
  try {
    for await (const chunk of iterable) {
      onData(chunk)
    }
    onEnd()
  } catch (error) {
    onError(error)
  }
}