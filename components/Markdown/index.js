import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeMathjax from "rehype-mathjax";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import { dracula, CopyBlock } from "react-code-blocks";

const ReactMarkDown = ({ data }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeMathjax, rehypeRaw]}
      className="user-prompt" components=
      {{
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          if (!inline && match) {
            //const codeString = String(children).replace(/\n$/, "");
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
                fontSize: "14px"
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
                textAlign: "left"
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
        ol({ children, ...props }) {
          return (
            <p
              style={{ listStyleType: "number" }}
              className="text-lg max-msm:text-[15px] text-[#FFF] font-helvetica font-normal tracking-[0.2px] leading-[28.8px]"
              {...props}
            >
              {children}
            </p>
          );
        },
        ul({ children, ...props }) {
          return (
            <p
              style={{ listStyleType: "number" }}
              className="text-lg max-msm:text-[15px] text-[#FFF] font-helvetica font-normal tracking-[0.2px] leading-[28.8px]"
              {...props}
            >
              {children}
            </p>
          );
        },
        // li({ children, ...props }) {
        //   return (
        //     <li
        //       style={{ listStyleType: "disc" }}
        //       className="text-lg text-[#FFF] font-helvetica font-normal tracking-[0.2px] leading-[28.8px]"
        //     >
        //       {children}
        //     </li>
        //   );
        // }
      }}  
    >
      {data}
    </ReactMarkdown>
  );
};
export default ReactMarkDown;
