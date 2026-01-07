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
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh-hans", name: "Chinese (Simplified)" },
  { code: "zh-hant", name: "Chinese (Traditional)" },
  { code: "ar", name: "Arabic" },
  { code: "ru", name: "Russian" },
  { code: "tr", name: "Turkish" },
  { code: "nl", name: "Dutch" },
  { code: "pl", name: "Polish" },
  { code: "sv", name: "Swedish" },
  { code: "th", name: "Thai" },
  { code: "vi", name: "Vietnamese" },
  { code: "id", name: "Indonesian" },
  { code: "hi", name: "Hindi" },
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
    <div className="h-10 border-b border-gray-200 bg-gray-50 flex items-center px-4 gap-2 overflow-x-auto">
      <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />

      {project.locales.map((locale) => {
        const localeInfo = AVAILABLE_LOCALES.find((l) => l.code === locale);
        return (
          <button
            key={locale}
            className={cn(
              "flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-colors",
              currentLocale === locale
                ? "bg-white text-blue-600 shadow-sm border border-gray-200"
                : "text-gray-600 hover:bg-gray-100"
            )}
            onClick={() => setCurrentLocale(locale)}
          >
            <span className="uppercase text-xs font-bold">{locale}</span>
            {localeInfo && (
              <span className="text-gray-400 hidden sm:inline">
                {localeInfo.name}
              </span>
            )}
            {project.locales.length > 1 && currentLocale === locale && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeLocale(locale);
                  if (currentLocale === locale) {
                    setCurrentLocale(project.locales.find((l) => l !== locale) || "en");
                  }
                }}
                className="ml-1 p-0.5 hover:bg-red-100 rounded"
              >
                <X className="w-3 h-3 text-gray-400 hover:text-red-500" />
              </button>
            )}
          </button>
        );
      })}

      {/* Add Locale */}
      {showAddLocale ? (
        <div className="flex items-center gap-1">
          <Select
            onValueChange={(value) => {
              addLocale(value);
              setShowAddLocale(false);
            }}
          >
            <SelectTrigger className="h-7 w-40 text-sm">
              <SelectValue placeholder="Select locale..." />
            </SelectTrigger>
            <SelectContent>
              {availableToAdd.map((locale) => (
                <SelectItem key={locale.code} value={locale.code}>
                  <span className="uppercase text-xs font-bold mr-2">
                    {locale.code}
                  </span>
                  {locale.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={() => setShowAddLocale(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-gray-500"
          onClick={() => setShowAddLocale(true)}
          disabled={availableToAdd.length === 0}
        >
          <Plus className="w-4 h-4" />
          <span className="ml-1 text-xs">Add Locale</span>
        </Button>
      )}
    </div>
  );
}
