import { useRouter } from "next/router";
import { useState } from "react";

import { Modal } from "@/components/molecules/modal/Modal";

import { HackButton, HackQuestion, QUESTIONS } from "./data";

// Combines all of the parameters stored against each button press into one search page query
const rollUpParams = (buttonPresses: HackButton[]) =>
  buttonPresses
    .filter((button) => button.searchParams)
    .map((button) => button.searchParams.replaceAll("+", " ").replaceAll("%28", "(").replaceAll("%29", ")").split("&"))
    .flat()
    .reduce((allParams, paramPair) => {
      const [key, value] = paramPair.split("=");
      if (!(key in allParams)) return { ...allParams, [key]: value };
      if (typeof allParams[key] === "string") return { ...allParams, [key]: [allParams[key], value] };
      return { ...allParams, [key]: [...allParams[key], value] };
    }, {});

interface IProps {
  onClose: () => void;
}

export const HackathonQuestions = ({ onClose }: IProps) => {
  const router = useRouter();
  const [buttonsPressed, setButtonsPressed] = useState<HackButton[]>([]);

  const reversedButtons = buttonsPressed.toReversed();

  // Drive the currently displayed question off of buttons pressed so far
  let question: HackQuestion = QUESTIONS[0];
  if (buttonsPressed.length > 0) {
    // When a button is pressed that goes to a page, prevent showing the first question briefly
    const mostRecentQuestionButton = reversedButtons.find((button) => button.goToId);
    if (mostRecentQuestionButton) question = QUESTIONS.find((quest) => quest.id === mostRecentQuestionButton.goToId);
  }

  const image = buttonsPressed.length > 0 ? reversedButtons[0].showImage : "";

  const goBack = () => {
    setButtonsPressed((current) => {
      const currentCopy = [...current];
      currentCopy.pop();
      return currentCopy;
    });
  };

  const pressButton = (button: HackButton) => {
    const allButtonPresses = [...buttonsPressed, button];

    if (button.goToPage) {
      const rolledUpParams = rollUpParams(allButtonPresses);

      router.push({
        pathname: button.goToPage,
        query: rolledUpParams,
      });
    }

    setButtonsPressed(allButtonPresses);
  };

  return (
    <>
      {!image && (
        <div className="flex flex-col gap-6 min-w-[200px] max-w-[530px]">
          <div className="flex flex-col gap-2">
            {question.text.map((line, lineIndex) => (
              <p key={`line-${lineIndex}`}>{line}</p>
            ))}
          </div>
          <div className="flex flex-col gap-2 items-start">
            {question.buttons.map((button, buttonIndex) => (
              <button
                role="button"
                key={buttonIndex}
                onClick={() => pressButton(button)}
                className="text-brand underline underline-offset-4 decoration-gray-300 hover:decoration-gray-500"
              >
                {button.text}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2 items-start">
            {buttonsPressed.length > 0 && (
              <button role="button" onClick={goBack} className="underline underline-offset-4 decoration-gray-300 hover:decoration-gray-500">
                Go back one question
              </button>
            )}
            <button role="button" onClick={onClose} className="underline underline-offset-4 decoration-gray-300 hover:decoration-gray-500">
              Never mind
            </button>
          </div>
        </div>
      )}

      {image && (
        <>
          <p>Here's a chart for you.</p>
          <Modal isOpen onClose={onClose}>
            <img src={`HACKATHON/${image}`} />
          </Modal>
        </>
      )}
    </>
  );
};
