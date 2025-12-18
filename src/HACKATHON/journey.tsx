import { useState } from "react";

import { Clippy } from "./clippy";
import { HackathonQuestions } from "./questions";

type TState = "prompt" | "questions" | "off";

export const HackathonJourney = () => {
  const [step, setStep] = useState<TState>("prompt");

  return (
    <div className="fixed z-2001 bottom-5 left-5 flex items-end gap-4">
      <Clippy eyes="right" positionClasses={step === "off" ? "translate-y-[180px]" : "translate-y-[0px]"} />
      {step !== "off" && (
        <div className="bg-white rounded-lg p-4 mb-8 relative">
          <div className="w-0 h-0 border border-x-[10px] border-b-[25px] border-transparent border-b-white rotate-[270deg] absolute -left-5 bottom-[1em]" />

          {step === "prompt" && (
            <>
              <p>
                Hello, I'm CLPP!
                <br />
                It looks like you're new here.
                <br />
                Can I help you get started?
              </p>
              <div className="flex flex-col items-start gap-2 pt-6">
                <button
                  role="button"
                  onClick={() => setStep("questions")}
                  className="block text-brand underline underline-offset-4 decoration-gray-300 hover:decoration-gray-500"
                >
                  Yes please!
                </button>
                <button
                  role="button"
                  onClick={() => setStep("off")}
                  className="block text-brand underline underline-offset-4 decoration-gray-300 hover:decoration-gray-500"
                >
                  Go back to the nineties
                </button>
              </div>
            </>
          )}

          {step === "questions" && <HackathonQuestions onClose={() => setStep("off")} />}
        </div>
      )}
    </div>
  );
};
