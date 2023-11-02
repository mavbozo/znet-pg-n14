import { IQuestion } from "./definitions"
import { questions } from "./placeholder-data";

export async function fetchQuestions(): Promise<IQuestion[]> {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
    const data = questions;
    return data;
}
