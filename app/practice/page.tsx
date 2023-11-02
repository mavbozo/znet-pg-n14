import PracticePage from "@/components/Quiz";
import { fetchQuestions } from "../lib/data";

export default async function Page() {
  const data = await fetchQuestions();
  return <PracticePage data={data} />;
}
