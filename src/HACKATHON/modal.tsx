import { X } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";

import { Button } from "@/components/atoms/button/Button";
import { Modal } from "@/components/molecules/modal/Modal";
import { ARROW_LEFT } from "@/constants/chars";

import { HackButton, HackQuestion, QUESTIONS } from "./data";

// Combines all of the parameters stored against each button press into one search page query
const rollUpParams = (buttonPresses: HackButton[]) =>
  buttonPresses
    .filter((button) => button.searchParams)
    .map((button) => button.searchParams.replace("+", " ").split("&"))
    .flat()
    .reduce((allParams, paramPair) => {
      const [key, value] = paramPair.split("=");
      if (!(key in allParams)) return { ...allParams, [key]: value };
      if (typeof allParams[key] === "string") return { ...allParams, [key]: [allParams[key], value] };
      return { ...allParams, [key]: [...allParams[key], value] };
    }, {});

export const HackathonModal = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
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

      setIsOpen(false);
      router.push({
        pathname: button.goToPage,
        query: rolledUpParams,
      });
    }

    setButtonsPressed(allButtonPresses);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} showCloseButton={false} cardClasses="max-w-[initial]! w-[80vw]!">
      <div className="flex flex-col items-centre justify-between h-[50vh]">
        {/* Controls */}
        <div className="flex justify-between h-5 mb-4">
          <div>
            {buttonsPressed.length > 0 && (
              <button role="button" onClick={goBack} className="text-gray-500">
                {ARROW_LEFT} Back
              </button>
            )}
          </div>
          <button role="button" onClick={() => setIsOpen(false)} className="text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* Question */}
        {!image && (
          <>
            <h1 className="text-3xl text-gray-950 text-center font-bold">{question.text}</h1>
            <div className="flex flex-col items-center gap-4 flex-1 justify-center">
              {question.buttons.map((button, buttonIndex) => (
                <Button key={buttonIndex} onClick={() => pressButton(button)} className="inline-block">
                  {button.text}
                </Button>
              ))}
            </div>
            <div>
              {buttonsPressed
                .filter((button) => button.searchParams)
                .map((button, buttonIndex) => (
                  <p key={buttonIndex}>{button.searchParams}</p>
                ))}
            </div>
          </>
        )}

        {/* Image */}
        {image && <img src={image} />}
      </div>
    </Modal>
  );
};
