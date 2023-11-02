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
