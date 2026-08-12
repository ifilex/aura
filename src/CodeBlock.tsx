import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
    code: string;
    language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
    return (
        <SyntaxHighlighter language={language || 'text'} style={vscDarkPlus} PreTag="div">
            {code}
        </SyntaxHighlighter>
    );
}
