import { ChevronDown } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";
import type { Bot } from "../types";

interface HeaderProps {
  title: string;
  selectedBot: Bot | null;
  bots: Bot[];
  onBotChange: (bot: Bot) => void;
}

export default function Header({
  title,
  selectedBot,
  bots,
  onBotChange,
}: HeaderProps) {
  return (
    <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h1>

      <div className="flex items-center space-x-4">
        <ThemeToggle />

        <div className="relative">
          <select
            value={selectedBot?.id || ""}
            onChange={(e) => {
              const bot = bots.find((b) => b.id === e.target.value);
              if (bot) onBotChange(bot);
            }}
            className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar Bot</option>
            {bots.map((bot) => (
              <option key={bot.id} value={bot.id}>
                {bot.name} {bot.isActive ? "🟢" : "🔴"}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        <UserMenu />
      </div>
    </div>
  );
}
