import React, { useState, useEffect, useRef } from 'react';

const TextSelectorok = () => {
    const [selectedText, setSelectedText] = useState('');
    const [showReplyIcon, setShowReplyIcon] = useState(false);
    const [showReplyText, setShowReplyText] = useState(false);
    const [selectionCoordinates, setSelectionCoordinates] = useState({ x: 0, y: 0 });
    const contentEditableRef = useRef(null);

    useEffect(() => {
        document.addEventListener('mouseup', handleOutsideClick);

        return () => {
            document.removeEventListener('mouseup', handleOutsideClick);
        };
    }, []);

    const handleTextSelection = () => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (selectedText !== '') {
            setSelectedText(selectedText);
            setShowReplyIcon(true);
            setShowReplyText(false);
            const selectionRange = selection.getRangeAt(0);
            const rect = selectionRange.getBoundingClientRect();
            const parentRect = selection.anchorNode.parentElement.getBoundingClientRect();
            setSelectionCoordinates({ x: rect.left - parentRect.left + rect.width / 2, y: rect.top - parentRect.top });
        } else {
            setShowReplyIcon(false);
            setShowReplyText(false);
        }
    };

    const handleReplyIconClick = () => {
        setShowReplyIcon(false);
        setShowReplyText(true);
    };

    const handleCloseButtonClick = () => {
        setShowReplyText(false);
    };

    const handleOutsideClick = (event) => {
        if (!event.target.closest('.text-container')) {
            setShowReplyIcon(false);
            setShowReplyText(false);
        }
    };

    return (
        <div className="mt-4">
            <p>Select some text:</p>
            <div
                onMouseUp={handleTextSelection}
                className="text-container border border-gray-300 p-4 relative"
            >
                {showReplyIcon && (
                    <button
                        className="bg-white p-2 rounded cursor-pointer"
                        style={{ position: 'absolute', left: selectionCoordinates.x, top: selectionCoordinates.y - 40 }}
                        onClick={handleReplyIconClick}
                    >
                        Reply
                    </button>
                )}

                <p>a monumental challenge, threatening to disrupt ecosystems, economies, and livelihoods worldwide through extreme weather events</p>

            </div>

            {showReplyText && (
                <div className='display_onreply_button text-[#fff]'>
                    <p>Replying to:</p>
                    <span onClick={handleCloseButtonClick}>close</span>
                    <div
                        ref={contentEditableRef}
                        className="editable-div text-[#fff]"
                        contentEditable="true"
                    >
                        {selectedText}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TextSelectorok;
