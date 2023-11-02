import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
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
    const questions = data.rows.map((row) => ({
      id: row.id,
      text: row.text,
      options: row.options,
      correctAnswer: row.correct_answer,
    }));

    return NextResponse.json({ questions }, { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
