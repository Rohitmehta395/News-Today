// Frontend/src/components/RichTextEditor.jsx - RESPONSIVE IMPROVED
import React, { useState, useRef, useEffect } from "react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaLink,
  FaImage,
  FaCode,
  FaQuoteLeft,
} from "react-icons/fa";

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your article content...",
}) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    handleInput();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        executeCommand("insertImage", e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const insertLink = () => {
    if (linkUrl && linkText) {
      const link = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
      executeCommand("insertHTML", link);
      setIsLinkModalOpen(false);
      setLinkUrl("");
      setLinkText("");
    }
  };

  const toolbarButtons = [
    { command: "bold", icon: FaBold, title: "Bold", group: "format" },
    { command: "italic", icon: FaItalic, title: "Italic", group: "format" },
    {
      command: "underline",
      icon: FaUnderline,
      title: "Underline",
      group: "format",
    },
    {
      command: "insertUnorderedList",
      icon: FaListUl,
      title: "Bullet List",
      group: "list",
    },
    {
      command: "insertOrderedList",
      icon: FaListOl,
      title: "Numbered List",
      group: "list",
    },
    {
      command: "formatBlock",
      icon: FaQuoteLeft,
      title: "Quote",
      value: "blockquote",
      group: "block",
    },
    {
      command: "formatBlock",
      icon: FaCode,
      title: "Code Block",
      value: "pre",
      group: "block",
    },
  ];

  // Group buttons for better mobile layout
  const formatButtons = toolbarButtons.filter((btn) => btn.group === "format");
  const listButtons = toolbarButtons.filter((btn) => btn.group === "list");
  const blockButtons = toolbarButtons.filter((btn) => btn.group === "block");

  const ButtonGroup = ({ buttons, className = "" }) => (
    <div className={`flex gap-1 ${className}`}>
      {buttons.map((button, index) => {
        const Icon = button.icon;
        return (
          <button
            key={index}
            type="button"
            onClick={() => executeCommand(button.command, button.value)}
            className="p-2 rounded hover:bg-gray-200 transition-colors flex-shrink-0"
            title={button.title}
          >
            <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2">
        {isMobile ? (
          // Mobile Layout - Grouped and Stacked
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <ButtonGroup buttons={formatButtons} />
              <ButtonGroup buttons={listButtons} />
            </div>
            <div className="flex items-center justify-between">
              <ButtonGroup buttons={blockButtons} />
              <div className="flex gap-1">
                {/* Link Button */}
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(true)}
                  className="p-2 rounded hover:bg-gray-200 transition-colors"
                  title="Insert Link"
                >
                  <FaLink className="w-3 h-3" />
                </button>

                {/* Image Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded hover:bg-gray-200 transition-colors"
                  title="Insert Image"
                >
                  <FaImage className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Format Dropdown - Full Width on Mobile */}
            <select
              onChange={(e) => executeCommand("formatBlock", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded"
              defaultValue=""
            >
              <option value="">Format</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
              <option value="h4">Heading 4</option>
              <option value="p">Paragraph</option>
            </select>
          </div>
        ) : (
          // Desktop Layout - Single Row
          <div className="flex flex-wrap items-center gap-2">
            <ButtonGroup buttons={toolbarButtons} />

            {/* Separator */}
            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            {/* Link Button */}
            <button
              type="button"
              onClick={() => setIsLinkModalOpen(true)}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Insert Link"
            >
              <FaLink className="w-4 h-4" />
            </button>

            {/* Image Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Insert Image"
            >
              <FaImage className="w-4 h-4" />
            </button>

            {/* Format Dropdown */}
            <select
              onChange={(e) => executeCommand("formatBlock", e.target.value)}
              className="ml-2 px-2 py-1 text-sm border border-gray-300 rounded"
              defaultValue=""
            >
              <option value="">Format</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
              <option value="h4">Heading 4</option>
              <option value="p">Paragraph</option>
            </select>
          </div>
        )}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className={`p-4 outline-none overflow-y-auto ${
          isMobile
            ? "min-h-64 max-h-80 text-base"
            : "min-h-96 max-h-96 text-base"
        }`}
        style={{
          lineHeight: "1.6",
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Link Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`bg-white p-6 rounded-lg shadow-xl ${
              isMobile ? "w-full max-w-sm" : "w-96 max-w-[90vw]"
            }`}
          >
            <h3 className="text-lg font-semibold mb-4">Insert Link</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Link text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div
              className={`flex gap-2 mt-4 ${
                isMobile ? "flex-col" : "justify-end"
              }`}
            >
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className={`px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors ${
                  isMobile ? "order-2" : ""
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertLink}
                className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors ${
                  isMobile ? "order-1" : ""
                }`}
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom styles for the editor */}
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }

        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }
        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }
        [contenteditable] h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
        }
        [contenteditable] h4 {
          font-size: 1em;
          font-weight: bold;
          margin: 1.12em 0;
        }
        [contenteditable] p {
          margin: 1em 0;
          line-height: 1.6;
        }
        [contenteditable] blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1em;
          margin: 1em 0;
          font-style: italic;
          color: #6b7280;
          background-color: #f9fafb;
          padding: 1em;
          border-radius: 0.375rem;
        }
        [contenteditable] pre {
          background: #f3f4f6;
          padding: 1em;
          border-radius: 0.375rem;
          overflow-x: auto;
          font-family: monospace;
          font-size: 0.875em;
          margin: 1em 0;
        }
        [contenteditable] ul,
        [contenteditable] ol {
          margin: 1em 0;
          padding-left: 2em;
        }
        [contenteditable] li {
          margin: 0.5em 0;
        }
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
          margin: 1em 0;
        }
        [contenteditable] a {
          color: #3b82f6;
          text-decoration: underline;
        }
        [contenteditable] a:hover {
          color: #1d4ed8;
        }
        [contenteditable] strong {
          font-weight: bold;
        }
        [contenteditable] em {
          font-style: italic;
        }
        [contenteditable] u {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
