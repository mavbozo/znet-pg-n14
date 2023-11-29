import { assign, createMachine } from "xstate";
import { fetchQuestions, evaluateSubmission } from "../../app/lib/data";

export interface QuestionType {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  userAnswer?: number;
}

interface PracticeContext {
  questions: QuestionType[];
  currentQuestionIndex: number;
  score: number;
}

export const practiceMachine = createMachine<PracticeContext>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOBDAxgFwJabAFksALXAOzADpcIAbMAYgAUAlAQQGEAVASU4CiAfQDK3dq24CAIgG0ADAF1EKAPaxceVeRUgAHogCsAJgA0IAJ6IAnPIBsVW3eN351gByGALNeMBmAF8A8zQsPAJiTDJKKlCcfDAROA1tKgBHAFc4LXJpXFhkOnQLSEZ2ADkRAHUBVlEAVQAhQl5uKTklXWR1TVxtXQMEQz8Hazt3AHYvQ2sARnkfQztzKwQfWao7CbHrQ3lhk1nJoJCMeIjSCmo48MTkvvJ0rNgcvIKikohGcoEqoQBFeoCMS8ADy5SErAEgOB7QUyiQIG6GhyA0QkxWiDsdj8m22Uz2Xmm7j87hOSLOt0i0WulISSVgKUemWyDzehWKpTYXD4giEADFeOVeCIABIyeFdHqoxGDWZTBzyo4TTz7fzyPyYhDGKZULwTOyGCbyey+Kbkm4JalXWJ0ggMplPVnadkfLkcHj8YQAGQE-O4ksRyN6-VlRhGjnGBLmC12y0siAm2yosz8xnc8qm01JEwtdqIlxilvt91SsAyACMALb5JkCABu6DoGXQr3yHM+31+AKBIPBkOhvbhnSD0oeaKGEbGk2mMcW8dWfl2VGMLiN-mcez2ueCFLCVsLtP3JcZDyo5ertYeDabLbb705X25nr5guFYolI7UKPHYYQ8q8RUJmVVUTD8DUtSXLwqAmJdDE8WZZ3kWZDDzY8CyiG1izuU8y0rGtcPIG9m1bNl2zdJ8PV5H0-QDL8kTHUNQDlYxphgrxjCOHFgI8A0tUMFC9XcXYZyXVNjFQ3dsOtIt8wdM8GHQeswE4bQADNcFQKtSJdcjH0YX12AANWEThwUFVhCE-BFvxDHQ-wAoCQK3dVNQTBBDXcKhSXTFDplTeQDTQ84MJpW10Pk1JFOU1TyA0rSdNyPTO0MkyhE4CpBG9X0OhshifyY-REFmVjDHYzj3G42ZeIXLF4O89xfO8ATwKCqT8xko8QtYOAMjobBXX0n4-mfaiBxhMRrKlAr7OYowzHcjMqD2E19j2dwfBJIJd3IVQIDgLoOsPaa7InABaawtTOuxgqpQ8aHoMATplOb-12YxHGMHYtkmSZWK1bFoMAuxEN2Hx9lmWZboPTDZIi0tZvy06-yXSDApgtdsU8LwTS2G72vQzrwpCyLmWee8O0gZ7f1e4x5A++C6fAklDW8dwtQNMrxMqpM-CWXHoYuWGutuUnz3wq9tGIu8yIfT5qcKwYxg2aw-CmOZGrcOYFtWfUvP8MYcc41xxi8QXQqwuSEaoaKVPUzTtIpiiFcRuVpgZzxVY8I4-omAH6vcRqVWzVWVXNonsJ68t+sG+XRxmidqtcPUvvGRr9XlQOtR1CY9QNVw3AzJnDEkoIgA */
    context: {
      questions: [],
      currentQuestionIndex: 0,
      score: 0,
    },
    id: "practiceMachine",
    initial: "idle",
    states: {
      idle: {
        on: {
          PRACTICE_STARTED: {
            target: "practiceSession",
          },
        },
      },
      practiceSession: {
        initial: "fetchingQuestions",
        states: {
          fetchingQuestions: {
            invoke: {
              src: "fetchQuestionsService",
              onDone: {
                target: "questionDisplayed",
                actions: assign({
                  questions: (context, event) => event.data,
                }),
              },
            },
          },
          questionDisplayed: {
            on: {
              ANSWER_SUBMITTED: {
                target: "evaluatingSubmission",
              },
              NEW_QUESTION_REQUESTED: {
                target: "questionDisplayed",
                cond: "hasMoreQuestions",
                actions: {
                  type: "incrementQuestionIndex",
                },
              },
              PRACTICE_FINISHED: {
                target: "#practiceMachine.practiceResultDisplayed",
              },
              PRACTICE_LEFT: {
                target: "leaveConfirmationDisplayed",
              },
            },
          },
          evaluatingSubmission: {
            invoke: {
              src: "evaluateSubmissionService",
              onDone: {
                target: "submissionEvaluationDisplayed",
                actions: (context, event) => {
                  let qs = context.questions;
                  qs[context.currentQuestionIndex]["correctAnswer"] =
                    event.data.correctAnswer;
                  qs[context.currentQuestionIndex]["userAnswer"] =
                    event.data.answer;
                  return {
                    questions: qs,
                    score: event.data.score,
                  };
                },
              },
            },
          },
          submissionEvaluationDisplayed: {
            exit: {
              type: "updateScore",
            },
            on: {
              NEW_QUESTION_REQUESTED: {
                target: "questionDisplayed",
                cond: "hasMoreQuestions",
                actions: {
                  type: "incrementQuestionIndex",
                },
              },
              PRACTICE_FINISHED: {
                target: "#practiceMachine.practiceResultDisplayed",
              },
              PRACTICE_LEFT: {
                target: "leaveConfirmationDisplayed",
              },
            },
          },
          leaveConfirmationDisplayed: {
            on: {
              LEAVE_CONFIRMED: {
                target: "#practiceMachine.idle",
                actions: {
                  type: "resetQuiz",
                },
              },
              LEAVE_CANCELLED: {
                target: "questionDisplayed",
              },
            },
          },
        },
      },
      practiceResultDisplayed: {
        on: {
          NEW_PRACTICE_REQUESTED: {
            target: "#practiceMachine.practiceSession.questionDisplayed",
            actions: {
              type: "resetQuiz",
            },
          },
        },
      },
    },
    schema: {
      events: {} as
        | { type: "PRACTICE_STARTED" }
        | { type: "ANSWER_SUBMITTED" }
        | { type: "NEW_QUESTION_REQUESTED" }
        | { type: "PRACTICE_FINISHED" }
        | { type: "PRACTICE_LEFT" }
        | { type: "LEAVE_CONFIRMED" }
        | { type: "LEAVE_CANCELLED" }
        | { type: "NEW_PRACTICE_REQUESTED" },
      context: {} as PracticeContext,
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      incrementQuestionIndex: (context, event) => {
        context.currentQuestionIndex++;
      },

      resetQuiz: (context, event) => {
        context.score = 0;
        context.currentQuestionIndex = 0;
      },
    },
    services: {
      fetchQuestionsService: async (context, event) => {
        console.log("fetching questions...");
        return fetchQuestions();
      },
      evaluateSubmissionService: async (context, event) => {
        let newScore = context.score;
        let submissionResult = await evaluateSubmission(
          event.answer,
          context.questions[context.currentQuestionIndex].id
        );
        if (submissionResult.correct) {
          newScore = context.score + 1;
        } else {
          newScore = context.score;
        }
        console.log("submission evaluated");
        return new Promise((resolve, reject) => {
          resolve({
            score: newScore,
            answer: event.answer,
            correctAnswer: submissionResult.correctAnswer,
          });
        });
      },
    },
    guards: {
      hasMoreQuestions: (context, event) => {
        return context.currentQuestionIndex < context.questions.length - 1;
      },
    },
    delays: {},
  }
);
