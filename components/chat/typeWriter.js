import React, { useState, useEffect } from "react";
import ReactMarkDown from "../Markdown";

const Typewriter = ({ text, delay, onTypingEnd }) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Typing logic goes here

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      console.log("This is called to stop animation!");
      onTypingEnd();
    }
  }, [currentIndex, delay, text]);

  return <ReactMarkDown data={currentText} />;
  //   <span>{currentText}</span>;
};

export { Typewriter };
