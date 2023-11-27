import { practiceMachine } from "./machine";
import { interpret } from "xstate";
import { createModel } from "@xstate/test";
import { describe, expect, test, it } from "@jest/globals";
import "dotenv/config";
import { strictEqual } from "assert";
import { waitFor } from "xstate/lib/waitFor";

describe("end states check", () => {
  it('should eventually reach "submissionEvaluationDisplayed"', (done) => {
    const pmService = interpret(practiceMachine).onTransition((state) => {
      // this is where you expect the state to eventually
      // be reached
      console.log("transition happened: ", "state.value", state.value);
      // console.log(state);
      // console.log(state.context);

      if (state.changed) {
        console.log("state changed. state.value:", state.value);
      }

      if (state.matches("practiceSession.submissionEvaluationDisplayed")) {
        console.log("submissionEvaluationDisplayed");
        // console.log(state.context);
        console.log("questions count:", state.context.questions.length);
        done();
      }
    });

    pmService.start();

    // send zero or more events to the service that should
    // cause it to eventually reach its expected state
    pmService.send([
      { type: "PRACTICE_STARTED" },
      // { type: "ANSWER_SUBMITTED", answer: 0 },
    ]);

    waitFor(pmService, (state) => {
      console.log("waiting for questionDisplayed");
      return state.matches("practiceSession.questionDisplayed");
    });

    pmService.send([{ type: "ANSWER_SUBMITTED", answer: 0 }]);

    waitFor(pmService, (state) => {
      console.log("waiting for submissionEvaluationDisplayed");
      return state.matches("practiceSession.evaluatingSubmission");
    });
  }, 5000);
});
