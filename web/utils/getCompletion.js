const Groq = require("groq-sdk");
const dotenv = require('dotenv');

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getGroqChatCompletion(message, model) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
    model: model,
  });
}

// Using example 
// async function main() {
//   const chatCompletion = await getGroqChatCompletion("Hãy giải thích về thuật toán k-mean clustering và imlpement bằng python.", "llama3-groq-70b-8192-tool-use-preview");
//   console.log(chatCompletion.choices[0]?.message?.content || "");
// }
// main();

module.exports = { getGroqChatCompletion };