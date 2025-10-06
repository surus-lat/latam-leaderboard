import React from 'react';

/**
 * Parses markdown-style links in text and converts them to React elements
 * @param text - Text that may contain markdown links in format [text](url)
 * @returns React element with parsed links
 */
export function parseMarkdownLinks(text: string): React.ReactNode {
  // Regular expression to match markdown links [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // Add the link
    const linkText = match[1];
    const linkUrl = match[2];
    parts.push(
      <a
        key={match.index}
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline"
      >
        {linkText}
      </a>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last link
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  // If no links were found, return the original text
  if (parts.length === 0) {
    return text;
  }

  return <>{parts}</>;
}




