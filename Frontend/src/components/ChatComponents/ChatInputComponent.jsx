import React, { useRef, useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import { Image, Send, X } from "lucide-react";

const ChatInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessages } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessages({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  return (
    <>
      <div className="p-4 w-full bg-black border-t border-zinc-800">
        {imagePreview && (
          <div className="mb-3 flex items-center gap-2">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              />
              <button
                onClick={removeImage}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-zinc-800 text-white
          flex items-center justify-center"
                type="button"
              >
                <X className="size-3" />
              </button>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full"
        >
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-white placeholder-zinc-500 focus:outline-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`p-2 rounded-full hover:bg-zinc-800 transition ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={18} />
          </button>

          <button
            type="submit"
            className="p-2 rounded-full hover:bg-zinc-800 text-zinc-300 transition disabled:opacity-50"
            disabled={!text.trim() && !imagePreview}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
};

export default ChatInput;
