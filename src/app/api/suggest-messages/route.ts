
// import { NextResponse } from "next/server";
// import OpenAI from "openai";

// const openai = new OpenAI({
//     apiKey:process.env.OPENAI_API_KEY
// });

// export const runtime = 'edge'


// export async function POST(request:Request) {
    
//    try {
//     //  const {messages} = await request.json();

//     const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
 
 
//      const response = await openai.chat.completions.create({
         
//          model: "gpt-4o",
//          max_tokens:400,
//          prompt,
//         //  messages: [{"role": "user", "content": "write a haiku about ai"}]
     
         
//      });
//      return response
//    } catch (error) {
//        if(error instanceof OpenAI.APIError){
//             const {name,status,headers,message} = error
//             return NextResponse.json({
//                 name,status,headers,message
//             },{status})
//        }else{
//         console.error('An unexpected Eroor Occured',error)
//         throw error
//        }
//    }
// }


import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    // Define the messages array for the OpenAI API
    const messages: Array<{
      role: "system" | "user" | "assistant";
      content: string;
    }> = [
      {
        role: "system",
        content:
          "You are a helpful assistant that generates open-ended and engaging questions for a diverse and anonymous social messaging platform. Avoid personal or sensitive topics, focusing instead on universal themes to encourage friendly and meaningful interactions.",
      },
      {
        role: "user",
        content:
          "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.",
      },
    ];

    // Call the OpenAI API with the messages
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages, // Correctly structured messages array
      max_tokens: 400,
    });

    // Return the result
    return NextResponse.json(
      {
        success: true,
        questions: response.choices[0]?.message?.content || "No response",
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      // Handle API-specific errors
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, status, headers, message }, { status });
    } else {
      // Handle unexpected errors
      console.error("An unexpected error occurred:", error);
      throw error;
    }
  }
}

