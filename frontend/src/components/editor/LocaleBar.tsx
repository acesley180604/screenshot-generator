"use client";

import React, { useState } from "react";
import { Plus, X, Globe } from "lucide-react";
import { useEditorStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const AVAILABLE_LOCALES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh-hans", name: "Chinese (Simplified)", flag: "🇨🇳" },
  { code: "zh-hant", name: "Chinese (Traditional)", flag: "🇹🇼" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "pl", name: "Polish", flag: "🇵🇱" },
  { code: "sv", name: "Swedish", flag: "🇸🇪" },
  { code: "th", name: "Thai", flag: "🇹🇭" },
  { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
  { code: "id", name: "Indonesian", flag: "🇮🇩" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
];

export function LocaleBar() {
  const {
    project,
    currentLocale,
    setCurrentLocale,
    addLocale,
    removeLocale,
  } = useEditorStore();

  const [showAddLocale, setShowAddLocale] = useState(false);

  const availableToAdd = AVAILABLE_LOCALES.filter(
    (l) => !project.locales.includes(l.code)
  );

  return (
    <div className="h-12 border-b border-[#2c2c2e] bg-[#1c1c1e]/60 backdrop-blur-xl flex items-center px-5 gap-3 overflow-x-auto">
      {/* Icon */}
      <div className="flex items-center gap-2 text-[#8e8e93] flex-shrink-0">
        <Globe className="w-4 h-4" />
        <span className="text-[11px] font-semibold uppercase tracking-wide">Languages</span>
      </div>

      <div className="h-5 w-px bg-[#3a3a3c] flex-shrink-0" />

      {/* Locale tabs */}
      <div className="flex items-center gap-1.5">
        {project.locales.map((locale) => {
          const localeInfo = AVAILABLE_LOCALES.find((l) => l.code === locale);
          const isActive = currentLocale === locale;

          return (
            <button
              key={locale}
              className={cn(
                "group flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[#0a84ff] text-white shadow-sm"
                  : "text-[#a1a1a6] hover:bg-[#2c2c2e] hover:text-[#f5f5f7]"
              )}
              onClick={() => setCurrentLocale(locale)}
            >
              {localeInfo && (
                <span className="text-sm">{localeInfo.flag}</span>
              )}
              <span className="uppercase text-[11px] font-bold tracking-wide">{locale}</span>
              {isActive && project.locales.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeLocale(locale);
                    const nextLocale = project.locales.find((l) => l !== locale) || "en";
                    setCurrentLocale(nextLocale);
                  }}
                  className="ml-0.5 p-0.5 rounded hover:bg-white/20 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </button>
          );
        })}
      </div>

      {/* Add Locale */}
      {showAddLocale ? (
        <div className="flex items-center gap-2 animate-fadeIn">
          <Select
            onValueChange={(value) => {
              addLocale(value);
              setShowAddLocale(false);
            }}
          >
            <SelectTrigger className="h-8 w-48 text-sm bg-[#2c2c2e] border-[#3a3a3c]">
              <SelectValue placeholder="Select language..." />
            </SelectTrigger>
            <SelectContent>
              {availableToAdd.map((locale) => (
                <SelectItem key={locale.code} value={locale.code}>
                  <span className="flex items-center gap-2">
                    <span>{locale.flag}</span>
                    <span className="uppercase text-[10px] font-bold text-[#8e8e93]">
                      {locale.code}
                    </span>
                    <span>{locale.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setShowAddLocale(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-[#8e8e93] hover:text-[#0a84ff] flex-shrink-0"
          onClick={() => setShowAddLocale(true)}
          disabled={availableToAdd.length === 0}
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Add</span>
        </Button>
      )}
    </div>
  );
}
