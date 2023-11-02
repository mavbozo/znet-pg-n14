const { db } = require("@vercel/postgres");
const { questions } = require("../app/lib/placeholder-data");

async function seedQuestions(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "questions" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS questions (
        id UUID PRIMARY KEY,
        text TEXT NOT NULL,
        options TEXT[] NOT NULL,
        correct_answer INTEGER NOT NULL
    );
  `;

    console.log(`Created "questions" table`);

    // Insert data into the "questions" table
    const insertedQuestions = await Promise.all(
      questions.map(
        (question) => client.sql`
        INSERT INTO questions (id, text, options, correct_answer) 
        VALUES (${question.id}, ${question.text}, ${question.options}, ${question.correctAnswer})
        ON CONFLICT (id) DO NOTHING`
      )
    );

    console.log(`Seeded ${insertedQuestions.length} questions`);

    return {
      createTable,
      invoices: insertedQuestions,
    };
  } catch (error) {
    console.error("Error seeding questions:", error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedQuestions(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err
  );
});
