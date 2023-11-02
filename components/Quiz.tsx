"use client";
import React, { useEffect, useState } from "react";
import { interpret, State } from "xstate";

import { inspect } from "@xstate/inspect";

import { QuestionType, practiceMachine } from "../app/practice/machine";
import { Question, Result, LeaveConfirmation } from "@/components";
import { Evaluation } from "@/components/Evaluation";

if (typeof window !== "undefined") {
  inspect({
    /* options */
    iframe: false, // open in new window
  });
}

interface PracticeContext {
  questions: QuestionType[];
  currentQuestionIndex: number;
  selectedAnswers: number[];
  score: number;
}

const PracticePage = ({ data }: { data: QuestionType[] }) => {
  const [state, setState] = useState(practiceMachine.initialState);
  const [service, setService] = useState<any>(null);
  const questions = state.context.questions;

  // Start the service when the component mounts
  useEffect(() => {
    const practiceService = interpret(practiceMachine, { devTools: true })
      .onTransition(setState)
      .start();

    setService(practiceService);

    return () => {
      practiceService.stop();
    };
  }, []);

  const handleStartPractice = () => service.send({ type: "PRACTICE_STARTED" });

  const handleAnswerSubmit = (answer: number | null) => {
    service.send({ type: "ANSWER_SUBMITTED", answer });
  };

  const handleNextQuestion = () => {
    service.send({ type: "NEW_QUESTION_REQUESTED" });
  };

  const handleLeavePractice = () => {
    service.send({ type: "PRACTICE_LEFT" });
  };

  const handleFinishPractice = () => {
    service.send({ type: "PRACTICE_FINISHED" });
  };

  const handleNewPractice = () => {
    service.send({ type: "NEW_PRACTICE_REQUESTED" });
  };

  return (
    <div className="mx-5">
      {state.matches("idle") && (
        <button onClick={handleStartPractice}>Start Practice</button>
      )}
      {(state.matches("practiceSession.questionDisplayed") ||
        state.matches("practiceSession.submissionEvaluationDisplayed")) && (
        <>
          <div className="grid grid-cols-12 items-center gap-4">
            <div className="col-span-11 w-full bg-gray-200 rounded-full h-2.5 ">
              <div
                className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    ((state.context.currentQuestionIndex + 1) /
                      questions.length) *
                    100
                  }%`,
                }}
              ></div>
            </div>
            <p className="text-purple-700 text-sm">
              <span className="font-semibold text-lg">
                {state.context.currentQuestionIndex + 1}
              </span>
              /{questions ? questions.length : "?"} soal
            </p>
          </div>
          <Question
            data={questions}
            index={state.context.currentQuestionIndex}
            onSubmit={handleAnswerSubmit}
            onFinish={handleFinishPractice}
            onNextQuestion={handleNextQuestion}
          />
        </>
      )}
      {state.matches("practiceSession.submissionEvaluationDisplayed") && (
        <>
          <Evaluation
            answerSubmitted={
              questions[state.context.currentQuestionIndex].options[
                questions[state.context.currentQuestionIndex].userAnswer!
              ]
            }
            correctAnswer={
              questions[state.context.currentQuestionIndex].options[
                questions[state.context.currentQuestionIndex].correctAnswer
              ]
            }
          />
          <button onClick={handleLeavePractice}>Leave</button>
        </>
      )}
      {state.matches("practiceResultDisplayed") && (
        <Result score={state.context.score} onNewPractice={handleNewPractice} />
      )}
      {state.matches("practiceSession.leaveConfirmationDisplayed") && (
        <>
          <LeaveConfirmation
            onConfirm={() => service.send({ type: "LEAVE_CONFIRMED" })}
            onCancel={() => service.send({ type: "LEAVE_CANCELLED" })}
          />
        </>
      )}
    </div>
  );
};

export default PracticePage;
