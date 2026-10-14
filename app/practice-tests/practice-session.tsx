"use client";

import { useRef, useState } from "react";
import type { PracticeQuestion } from "./topic-types";

export default function PracticeSession({ questions }: { questions: PracticeQuestion[] }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [reviewMissed, setReviewMissed] = useState(false);
  const [message, setMessage] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);
  const answered = Object.keys(answers).length;
  const correct = questions.filter(q => answers[q.id] === q.answer).length;
  const missed = questions.filter(q => answers[q.id] !== q.answer);
  const shown = reviewMissed ? missed : questions;

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (answered !== questions.length) {
      setMessage(`Answer all ${questions.length} questions before checking your score. ${questions.length - answered} remaining.`);
      return;
    }
    setMessage("");
    setSubmitted(true);
    requestAnimationFrame(() => resultRef.current?.focus());
  }
  function restart() {
    setAnswers({}); setSubmitted(false); setReviewMissed(false); setMessage("");
  }
  function retryMissed() {
    setAnswers(current => Object.fromEntries(Object.entries(current).filter(([id, answer]) => questions.find(q => q.id === id)?.answer === answer)));
    setSubmitted(false); setReviewMissed(false); setMessage("Correct answers were kept. Try the missed questions again.");
  }

  return <form onSubmit={submit} className="mt-5">
    <div ref={resultRef} tabIndex={-1} className="rounded-xl border border-amber-300 bg-white p-5 focus-visible:outline-2 focus-visible:outline-amber-600" aria-live="polite">
      {submitted ? <><h3 className="text-xl font-bold">Your practice score: {correct} / {questions.length} ({Math.round(correct / questions.length * 100)}%)</h3><p className="mt-2 text-slate-600">{missed.length ? `${missed.length} questions to review. Read the explanations below, then try again.` : "You answered every question correctly. Keep learning with the linked resources."}</p><p className="mt-2 text-sm text-slate-600">This score reflects this practice set only. It is not certification or a prediction of a licensing exam result.</p><div className="mt-4 flex flex-wrap gap-3">{missed.length > 0 ? <><button type="button" onClick={() => setReviewMissed(value => !value)} className="min-h-11 rounded-lg border border-slate-300 px-4 font-bold">{reviewMissed ? "Show all questions" : "Review missed questions"}</button><button type="button" onClick={retryMissed} className="min-h-11 rounded-lg bg-[#071a35] px-4 font-bold text-white">Retry missed questions</button></> : null}<button type="button" onClick={restart} className="min-h-11 rounded-lg border border-slate-300 px-4 font-bold">Start over</button></div></> : <><h3 className="font-bold">{answered} of {questions.length} answered</h3><p className="mt-2 text-sm text-slate-600">Choose one answer per question, then check your score. Progress stays on this page and resets when you leave or refresh.</p></>}
      {message ? <p role="status" className="mt-3 font-semibold text-[#173b72]">{message}</p> : null}
    </div>
    <div className="mt-5 space-y-5">{shown.map(q => {
      const index = questions.findIndex(item => item.id === q.id);
      const isCorrect = answers[q.id] === q.answer;
      return <article key={q.id} className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <fieldset disabled={submitted}><legend className="text-lg font-bold">{index + 1}. {q.question}</legend><div className="mt-4 grid gap-2">{q.options.map((option, optionIndex) => <label key={`${q.id}-${optionIndex}`} className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border p-3 ${answers[q.id] === optionIndex ? "border-[#173b72] bg-blue-50" : "border-slate-200"}`}><input type="radio" name={q.id} value={optionIndex} checked={answers[q.id] === optionIndex} onChange={() => { setAnswers(current => ({ ...current, [q.id]: optionIndex })); setMessage(""); }} className="mt-1 size-4 shrink-0 accent-[#173b72]"/><span className="leading-6"><strong>{String.fromCharCode(65 + optionIndex)}.</strong> {option}</span></label>)}</div></fieldset>
        {submitted ? <div className={`mt-4 rounded-lg border p-4 ${isCorrect ? "border-green-300 bg-green-50" : "border-amber-300 bg-amber-50"}`}><p className="font-bold">{isCorrect ? "Correct" : "Review this answer"}</p><p className="mt-2 leading-7"><strong>Answer: {String.fromCharCode(65 + q.answer)}. {q.options[q.answer]}.</strong> {q.explanation}</p></div> : null}
      </article>;
    })}</div>
    {!submitted ? <button type="submit" className="mt-6 min-h-12 rounded-lg bg-[#e4b844] px-6 font-black text-[#071a35]">Check my score</button> : null}
  </form>;
}
