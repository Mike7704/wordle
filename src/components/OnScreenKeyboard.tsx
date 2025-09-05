"use client";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

export default function OnScreenKeyboard({ onKeyPress }: { onKeyPress: (key: string) => void }) {
  return (
    <Keyboard
      onKeyPress={onKeyPress}
      layout={{
        default: ["Q W E R T Y U I O P", "A S D F G H J K L", "Z X C V B N M {bksp} {enter}"],
      }}
      display={{
        "{enter}": "Enter",
        "{bksp}": "⌫",
      }}
      theme="hg-theme-default onScreenKeyboard"
      buttonTheme={[
        {
          class: "onScreenKeyboardKey",
          buttons: "Q W E R T Y U I O P A S D F G H J K L Z X C V B N M {enter} {bksp}",
        },
      ]}
    />
  );
}
