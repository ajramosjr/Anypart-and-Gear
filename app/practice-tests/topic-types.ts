export type PracticeQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};
export type PracticeTopic = {
  slug: string;
  title: string;
  category: string;
  description: string;
  lessons: { title: string; body: string }[];
  sources: { label: string; url: string }[];
  questions: PracticeQuestion[];
};
