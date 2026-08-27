import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renders the project's research markdown with prose styling.
 *
 *  Mermaid fences are shown as source rather than rendered: the diagram in the
 *  genre evolution map is the only one, and shipping a diagram renderer for it
 *  would cost more than it returns. The page links out to GitHub, which does
 *  render it.
 */
export default function Markdown({ body }: { body: string }) {
  return (
    <div className="research-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 rounded-lg border border-neutral-800">
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          code: ({ className, children, ...props }) => {
            const isBlock = /language-/.test(className ?? "");
            if (!isBlock) {
              return (
                <code
                  className="rounded bg-neutral-800 px-1.5 py-0.5 text-[0.85em] text-neutral-200"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            const isMermaid = /language-mermaid/.test(className ?? "");
            return (
              <>
                {isMermaid ? (
                  <p className="text-xs text-neutral-500 mb-2">
                    Diagram source — renders as a diagram on GitHub.
                  </p>
                ) : null}
                <code className={className} {...props}>
                  {children}
                </code>
              </>
            );
          },
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
