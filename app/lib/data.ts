import { sql } from "@vercel/postgres";
import { IQuestion } from "./definitions";

export async function fetchQuestions(): Promise<IQuestion[]> {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).

  try {
    // Artificially delay a reponse for demo purposes.
    // Don't do this in real life :)

    console.log("Fetching questions data...");
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    // we can be more strict with type by changing any to some type for rows in database
    const data = await sql<any>`SELECT * FROM questions limit 5`;

    console.log("Data fetch complete after 3 seconds.");

    // convert questions from database to IQuestion type
    return data.rows.map((row) => ({
      id: row.id,
      text: row.text,
      options: row.options,
      correctAnswer: row.correct_answer,
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

type IQuestionResponse = {
  questions: IQuestion[];
};

export async function fetchQuestionsAPI(): Promise<IQuestion[]> {
  try {
    // fetch the data from '/api/questions' with get method
    const res = await fetch("/api/questions", {
      method: "GET",
    });

    // if the response is not ok, throw error
    if (!res.ok) {
      throw new Error("Failed to fetch questions data.");
    }

    // convert the response to json
    const data = (await res.json()) as IQuestionResponse;

    // return the data
    return data.questions;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}
