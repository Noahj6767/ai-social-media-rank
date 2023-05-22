import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const input = req.body.input || "";
  const generateHashtags = req.body.generateHashtags || false;

  try {
    let completion;
    if (generateHashtags) {
      completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: generateHashtagsPrompt(input),
        temperature: 0.6,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6,
        stop: ["Human:", "AI:"],
      });
    } else {
      completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: generatePrompt(input),
        temperature: 0.6,
        max_tokens: 200,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6,
        stop: ["Human:", "AI:"],
      });
    }

    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(input) {
  return `The following is a conversation between a company owner and an AI that ranks social media post ideas based on how well they would go viral, perform, engagement, and relevance.

Human: Would posting on TikTok using relevant hashtags, following trends, and using a catchy title be a good idea?
AI: I am an AI created by Noah Hurley. I rank your idea a 99 out of 100. Your idea is already close to perfect, but I would recommend using a popular sound or effect to engage with TikTok's algorithm better.

Human: Would posting on Facebook trying to engage with teenagers be a good idea?
AI: I am an AI created by Noah Hurley. I rank your idea a 30 out of 100. This is a decent idea, but Facebook has an older demographic and will not reach as many teens as a post on TikTok, YouTube, or Instagram would. To make it better, try to narrow your target audience by highlighting specific interests or topics that are relevant to teenagers and post on social media that is more directed towards teenagers.

Human: Would posting on YouTube targeting teenagers and using catchy titles and flashy thumbnails be a good idea?
AI: I am an AI created by Noah Hurley. I rank your idea a 90 out of 100. Your idea is already close to perfect, but I would recommend creating content that is unique and can stand out from the crowd. Try to use trends and viral ideas to gain views and create content that will draw attention. Also, make sure you include clickable calls to action and
relevant keywords in your titles and descriptions.

Human: Would posting on Craigslist be a good idea to reach teenagers?
AI: I am an AI created by Noah Hurley. I rank your idea a 5 out of 100. Craigslist is not the ideal platform for reaching teenagers. I suggest focusing your efforts on more modern social media platforms such as Instagram, TikTok, Snapchat, and YouTube, which have a huge teenage audience. Focus on creating content that is relevant and engaging to your target audience, as well as using influencers to spread your message.

Human: ${input}
Names:`;
}

function generateHashtagsPrompt(input) {
  return `The following is a conversation between a company owner and an AI that generates hashtags that have association with the ${input}.

Human: Would posting on TikTok using relevant hashtags, following trends, and using a catchy title be a good idea?
AI: #fyp, #viral, #funny

Human: Would posting on Facebook trying to engage with teenagers be a good idea?
AI: #funny, #Teen, #Meme

Human: Would posting on YouTube targeting baseball fans and using catchy titles and flashy thumbnails be a good idea?
AI: #baseball, #mlb, #funny

Human: Would posting on Craigslist be a good idea to reach car enthusiasts?
AI: #car, #parts, #ford

Human: ${input}
Names:`;
}