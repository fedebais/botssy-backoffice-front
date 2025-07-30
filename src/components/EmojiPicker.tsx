"use client";

import { useState } from "react";
import { Smile } from "lucide-react";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const emojiCategories = {
  smileys: {
    name: "Caritas",
    emojis: [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "🤣",
      "😂",
      "🙂",
      "🙃",
      "😉",
      "😊",
      "😇",
      "🥰",
      "😍",
      "🤩",
      "😘",
      "😗",
      "😚",
      "😙",
      "😋",
      "😛",
      "😜",
      "🤪",
      "😝",
      "🤑",
      "🤗",
      "🤭",
      "🤫",
      "🤔",
      "🤐",
      "🤨",
      "😐",
      "😑",
      "😶",
      "😏",
      "😒",
      "🙄",
      "😬",
      "🤥",
      "😔",
      "😪",
      "🤤",
      "😴",
      "😷",
      "🤒",
      "🤕",
      "🤢",
      "🤮",
      "🤧",
      "🥵",
      "🥶",
      "🥴",
      "😵",
      "🤯",
      "🤠",
      "🥳",
      "😎",
      "🤓",
      "🧐",
    ],
  },
  gestures: {
    name: "Gestos",
    emojis: [
      "👍",
      "👎",
      "👌",
      "✌️",
      "🤞",
      "🤟",
      "🤘",
      "🤙",
      "👈",
      "👉",
      "👆",
      "🖕",
      "👇",
      "☝️",
      "👋",
      "🤚",
      "🖐️",
      "✋",
      "🖖",
      "👏",
      "🙌",
      "🤲",
      "🤝",
      "🙏",
      "✍️",
      "💪",
      "🦵",
      "🦶",
    ],
  },
  hearts: {
    name: "Corazones",
    emojis: [
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "🤍",
      "🤎",
      "💔",
      "❣️",
      "💕",
      "💞",
      "💓",
      "💗",
      "💖",
      "💘",
      "💝",
      "💟",
    ],
  },
  objects: {
    name: "Objetos",
    emojis: [
      "🎉",
      "🎊",
      "🎈",
      "🎁",
      "🏆",
      "🥇",
      "🥈",
      "🥉",
      "⚽",
      "🏀",
      "🏈",
      "⚾",
      "🎾",
      "🏐",
      "🏉",
      "🎱",
      "🏓",
      "🏸",
      "🥅",
      "🎯",
      "⛳",
      "🏹",
      "🎣",
      "🥊",
      "🥋",
      "🎽",
      "⛸️",
      "🥌",
      "🛷",
      "🎿",
      "⛷️",
      "🏂",
      "🏋️",
      "🤼",
      "🤸",
      "⛹️",
      "🤺",
      "🏇",
      "🧘",
      "🏄",
      "🏊",
      "🤽",
      "🚣",
      "🧗",
      "🚵",
      "🚴",
      "🏆",
      "🥇",
      "🥈",
      "🥉",
      "🏅",
      "🎖️",
      "🏵️",
      "🎗️",
    ],
  },
};

export default function EmojiPicker({
  onEmojiSelect,
  isOpen,
  onToggle,
}: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] =
    useState<keyof typeof emojiCategories>("smileys");

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        title="Agregar emoji"
      >
        <Smile className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="p-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors"
        title="Cerrar emojis"
      >
        <Smile className="w-5 h-5" />
      </button>

      <div className="absolute bottom-full right-0 mb-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
        {/* Category Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {Object.entries(emojiCategories).map(([key, category]) => (
            <button
              key={key}
              onClick={() =>
                setActiveCategory(key as keyof typeof emojiCategories)
              }
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                activeCategory === key
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Emoji Grid */}
        <div className="p-3 max-h-48 overflow-y-auto">
          <div className="grid grid-cols-8 gap-1">
            {emojiCategories[activeCategory].emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => {
                  onEmojiSelect(emoji);
                  onToggle();
                }}
                className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Access Row */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-2">
          <div className="flex justify-center space-x-1">
            {["😀", "😂", "😍", "😢", "😮", "😡", "👍", "👎", "❤️", "🎉"].map(
              (emoji, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onEmojiSelect(emoji);
                    onToggle();
                  }}
                  className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  title={emoji}
                >
                  {emoji}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
