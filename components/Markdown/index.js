import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeMathjax from "rehype-mathjax";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import { dracula, CopyBlock } from "react-code-blocks";
import TextSelectorok from "../text_history/Reply";

const ReactMarkDown = ({ data }) => {
  const onSetReplyText = (text) => {
    console.log("react mark down selected text", text);
  };
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeMathjax, rehypeRaw]}
      className="user-prompt"
      components={{
        // Custom components for styling and rendering
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          if (!inline && match) {
            const codeString = String(children);
            console.log("codeString", codeString);
            return (
              <CopyBlock
                text={codeString}
                language={match[1]}
                showLineNumbers={false}
                wrapLongLines
                theme={dracula}
                {...props}
              />
            );
          }
          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        table({ children, ...props }) {
          return (
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                fontFamily: "Arial, sans-serif",
                fontSize: "14px",
              }}
              {...props}
            >
              {children}
            </table>
          );
        },
        tr({ children, ...props }) {
          return (
            <tr style={{ backgroundColor: "#F8F8F8" }} {...props}>
              {children}
            </tr>
          );
        },
        td({ children, ...props }) {
          return (
            <td style={{ padding: "8px", border: "1px solid #ddd" }} {...props}>
              {children}
            </td>
          );
        },
        th({ children, ...props }) {
          return (
            <th
              style={{
                padding: "8px",
                border: "1px solid #ddd",
                fontWeight: "bold",
                textAlign: "left",
              }}
              {...props}
            >
              {children}
            </th>
          );
        },
        a({ href, children, ...props }) {
          return (
            <a
              style={{ color: "#007BFF", textDecoration: "none" }}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          );
        },
        // Custom paragraph component for styling
        p({ children, ...props }) {
          return (
            <div
              className="text-lg max-msm:text-[15px] text-[#FFF] font-helvetica font-normal tracking-[0.2px] leading-[28.8px]"
              {...props}
              style={{ whiteSpace: "pre-wrap" }}
            >
              {children}
            </div>
          );
        },
        // Custom list components for styling
        ol({ children, ...props }) {
          return (
            <ol
              style={{ listStyleType: "number" }}
              className="text-lg max-msm:text-[15px] pl-[21px] text-[#FFF] font-helvetica font-normal tracking-[0.2px] leading-[28.8px]"
              {...props}
            >
              <li>{children}</li>
            </ol>
          );
        },
        ul({ children, ...props }) {
          return (
            <ul
              style={{ listStyleType: "disc" }}
              className="text-lg max-msm:text-[15px] pl-[21px] text-[#FFF] font-helvetica font-normal tracking-[0.2px] leading-[28.8px]"
              {...props}
            >
              {children}
            </ul>
          );
        },
      }}
    >
      {data}
    </ReactMarkdown>
  );
};
export default ReactMarkDown;
