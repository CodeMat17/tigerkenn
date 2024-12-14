"use client";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading1,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
} from "lucide-react";
import { useEffect, useState } from "react";



const normalizeHTML = (content: string): string => {
  if (typeof window === "undefined") return content; // Prevent SSR access

  // Ensure valid HTML structure
  const wrapper = document.createElement("div");
  wrapper.innerHTML = content.trim();
  return wrapper.innerHTML; // Return cleaned HTML
};

type TiptapEditorProps = {
  initialContent?: string;
  onUpdate: (content: string) => void;
};

const TiptapEditor = ({
  initialContent = "<p>Write here...</p>",
  onUpdate,
}: TiptapEditorProps) => {

// const sanitizedContent = DOMPurify.sanitize(initialContent);


  const [isClient, setIsClient] = useState(false);

  // Ensure the component runs only on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full max-h-[600px] aspect-auto",
        },
      }),
      Link.configure({
        HTMLAttributes: {
          class: "text-blue-500 underline cursor-pointer hover:text-blue-300",
        },
      }),
    ],
    content: normalizeHTML(initialContent),
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    editorProps: {
      handleDOMEvents: {
        keydown: (_, event) => {
          if (!editor) return false;
          console.log("Editor State", editor.getJSON());

          // Handle spacebar issue
          if (event.key === " " && editor) {
            const { state } = editor;
            const { selection } = state;
            const { $from } = selection;

            // Handle space behavior at the end of the document
            if ($from.pos === $from.node(0).content.size) {
              event.preventDefault();
              editor.chain().focus().insertContent(" ").run();
              return true;
            }
          }

          return false; // Allow default behavior for other keys
        },
      },
    },
    immediatelyRender: false
  });

  // Sync content with editor when `initialContent` changes
  useEffect(() => {
    if (editor && initialContent) {
      // Clean the content
      // const sanitizedContent = DOMPurify.sanitize(initialContent, {ADD_ATTR: ['style']});

      // Set the content with parseOptions
      editor.commands.setContent(normalizeHTML(initialContent));
    }
  }, [editor, initialContent]);

  // Handle SSR rendering issues
  if (!isClient || !editor) {
    return <p>Loading editor...</p>;
  }

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      editor.chain().focus().setImage({ src: base64String }).run();
      onUpdate(editor.getHTML());
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className='menu-bar flex gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-md'>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded ${
            editor.isActive("bold")
              ? "bg-gray-300 dark:bg-gray-700"
              : "hover:bg-gray-200 dark:hover:bg-gray-900"
          }`}>
          <Bold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${
            editor.isActive("italic")
              ? "bg-gray-300 dark:bg-gray-700"
              : "hover:bg-gray-200 dark:hover:bg-gray-900"
          }`}>
          <Italic size={18} />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`p-2 rounded ${
            editor.isActive("heading", { level: 1 })
              ? "bg-gray-300 dark:bg-gray-700"
              : "hover:bg-gray-200 dark:hover:bg-gray-900"
          }`}>
          <Heading1 size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded ${
            editor.isActive("bulletList")
              ? "bg-gray-300 dark:bg-gray-700"
              : "hover:bg-gray-200 dark:hover:bg-gray-900"
          }`}>
          <List size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded ${
            editor.isActive("orderedList")
              ? "bg-gray-300 dark:bg-gray-700"
              : "hover:bg-gray-200 dark:hover:bg-gray-900"
          }`}>
          <ListOrdered size={18} />
        </button>
        <button
          onClick={() => {
            const { state } = editor;
            const { from, to } = state.selection;

            // Extract selected text
            const selectedText = state.doc.textBetween(from, to, " ");
            const url = prompt(
              "Enter a local URL or path (e.g., /page):",
              selectedText
            );

            if (url) {
              editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url })
                .run();
            }
          }}
          className={`p-2 rounded ${
            editor.isActive("link")
              ? "bg-gray-300 dark:bg-gray-700"
              : "hover:bg-gray-200 dark:hover:bg-gray-900"
          }`}>
          <LinkIcon size={18} />
        </button>

        <label className='flex items-center gap-1 cursor-pointer p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-900'>
          <ImageIcon size={18} />
          <input
            type='file'
            accept='image/*'
            onChange={handleImageUpload}
            hidden
          />
        </label>
      </div>
      <EditorContent
        editor={editor}
        className='p-4 border border-gray-300 dark:border-gray-700 rounded-md mt-2'
      />
    </div>
  );
};

export default TiptapEditor;
