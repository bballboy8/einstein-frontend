import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

const TextSelectorok = ({ children, setReplyText }) => {
  const [selectedText, setSelectedText] = useState("");
  const [showReplyIcon, setShowReplyIcon] = useState(false);

  const [selectionCoordinates, setSelectionCoordinates] = useState({
    x: 0,
    y: 0,
  });
  const contentEditableRef = useRef(null);

  useEffect(() => {
    document.addEventListener("mouseup", handleOutsideClick);

    return () => {
      document.removeEventListener("mouseup", handleOutsideClick);
    };
  }, []);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText !== "") {
      setSelectedText(selectedText);
      setShowReplyIcon(true);
      const selectionRange = selection.getRangeAt(0);
      const rect = selectionRange.getBoundingClientRect();
      const parentRect =
        selection.anchorNode.parentElement.getBoundingClientRect();
      setSelectionCoordinates({
        x: rect.left - parentRect.left + rect.width / 2,
        y: rect.top - parentRect.top,
      });
    } else {
      setShowReplyIcon(false);
    }
  };

  const handleReplyIconClick = () => {
    setShowReplyIcon(false);
    setReplyText(selectedText);
  };

  const handleOutsideClick = (event) => {
    if (!event.target.closest(".text-container")) {
      setShowReplyIcon(false);
    }
  };

  return (
    <>
      <span
        onMouseUp={handleTextSelection}
        className="text-container  p-4 relative"
      >
        {showReplyIcon && (
          <button
            className="bg-[#1B1E24] py-2 px-2 rounded-[10px] cursor-pointer border border-[#F2F2F2] min-w-[42px] min-h-[42px]"
            style={{
              position: "absolute",
              left: selectionCoordinates.x,
              top: selectionCoordinates.y - 10,
            }}
            onClick={handleReplyIconClick}
          >
            <Image
              alt=""
              width={24}
              height={24}
              src={"/reply-icon.png"}
              className="cursor-pointer"
            />
          </button>
        )}

        {children}
      </span>
    </>
  );
};

export default TextSelectorok;
