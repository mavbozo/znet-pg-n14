"use server";

import { sql } from "@vercel/postgres";
import { IQuestion, ISubmissionResult } from "./definitions";

export async function fetchQuestions(): Promise<IQuestion[]> {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).

  try {
    // Artificially delay a reponse for demo purposes.
    // Don't do this in real life :)

    // console.log("Fetching questions data...");
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    // we can be more strict with type by changing any to some type for rows in database
    const data =
      await sql<any>`SELECT id, text, options FROM questions limit 5`;

    // console.log("Data fetch complete after 3 seconds.");
    // convert questions from database to IQuestion type
    return data.rows.map((row) => ({
      id: row.id,
      text: row.text,
      options: row.options,
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch questions.");
  }
}

export async function evaluateSubmission(
  answer: number,
  questionId: string
): Promise<ISubmissionResult> {
  try {
    const q =
      await sql<any>`SELECT id, correct_answer FROM questions WHERE id = ${questionId} LIMIT 1`;
    const ret = {
      correct: q.rows[0].correct_answer === answer,
      correctAnswer: q.rows[0].correct_answer,
    };
    return ret;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to evaluate submission.");
  }
}
