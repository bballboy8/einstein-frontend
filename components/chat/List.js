import React, { useState, useEffect, useRef } from 'react';
import Image from "next/image";

function DualSelect() {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [leftOptions] = useState(['1:1', '3:2', '16:9', '21:9', '3:1', '4:1']);
  const [rightOptions] = useState(['1:1', '2:3', '9:16', '9:21', '1:3', '1:4']);
  const dropdownRef = useRef(null);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setShowOptions(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {showOptions && (
        <div className="absolute z-10 mt-2 mb-3 w-[150px] rounded-[10px] shadow-md bottom-full">
          <div className="flex justify-start gap-3">
            <ul className="w-[60px] py-2 bg-[#2E353C] rounded-[10px] font-nasalization text-[14.2px] text-[#fff] text-center">
              <Image
                alt=""
                width={32}
                height={12}
                src={"/svg/ratio-desktop.svg"}
                className="cursor-pointer ml-[13px] mt-[12px] mb-[6px]"
              />
              {leftOptions.map((option, index) => (
                <li className='cursor-pointer px-4 py-1.5 text-left hover:bg-[#14171a8a]' key={index} onClick={() => handleOptionSelect(option)}>{option}</li>
              ))}
            </ul>
            <ul className="w-[60px] bg-[#2E353C] rounded-[10px] font-nasalization text-[14.2px] text-[#fff]">
              <Image
                alt=""
                width={16}
                height={12}
                src={"/svg/ratio-mobile.svg"}
                className="cursor-pointer ml-[24px] mt-[10px] mb-[3px]"
              />

              {rightOptions.map((option, index) => (
                <li className='cursor-pointer px-4 py-1.5 hover:bg-[#14171a8a]' key={index} onClick={() => handleOptionSelect(option)}>{option}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <button
        onClick={toggleOptions}
        className="border border-[#2E353C] bg-[#2E353C] rounded-[50px] px-4 py-2 inline-flex items-center font-nasalization text-[14.2px] text-[#fff] min-w-[60px]">
        {selectedOption || '1:1'}
        <svg
          className="ml-2 h-5 w-6 text-[#fff]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M10 12a1 1 0 0 1-.707-.293l-4-4a1 1 0 1 1 1.414-1.414L10 10.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4A1 1 0 0 1 10 12z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}

export default DualSelect;
