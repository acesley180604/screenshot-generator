"use client";

import React, { useState } from "react";
import {
  Globe,
  Plus,
  Trash2,
  Languages,
  Loader2,
  Check,
  Copy,
  Wand2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useEditorStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ALL_LOCALES = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "es-mx", name: "Spanish (Mexico)", nativeName: "Español (México)", flag: "🇲🇽" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "pt-br", name: "Portuguese (Brazil)", nativeName: "Português (Brasil)", flag: "🇧🇷" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "zh-hans", name: "Chinese (Simplified)", nativeName: "简体中文", flag: "🇨🇳" },
  { code: "zh-hant", name: "Chinese (Traditional)", nativeName: "繁體中文", flag: "🇹🇼" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", rtl: true },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪" },
  { code: "no", name: "Norwegian", nativeName: "Norsk", flag: "🇳🇴" },
  { code: "da", name: "Danish", nativeName: "Dansk", flag: "🇩🇰" },
  { code: "fi", name: "Finnish", nativeName: "Suomi", flag: "🇫🇮" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά", flag: "🇬🇷" },
  { code: "cs", name: "Czech", nativeName: "Čeština", flag: "🇨🇿" },
  { code: "he", name: "Hebrew", nativeName: "עברית", flag: "🇮🇱", rtl: true },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", flag: "🇺🇦" },
];

interface LocalizationPanelProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function LocalizationPanel({ isExpanded = true, onToggle }: LocalizationPanelProps) {
  const {
    project,
    currentLocale,
    setCurrentLocale,
    addLocale,
    removeLocale,
    setDefaultLocale,
    selectedScreenshotId,
    updateTextTranslation,
  } = useEditorStore();

  const [showAddLocale, setShowAddLocale] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatingLocale, setTranslatingLocale] = useState<string | null>(null);
  const [expandedScreenshots, setExpandedScreenshots] = useState<Set<string>>(new Set());

  const selectedScreenshot = project.screenshots.find(s => s.id === selectedScreenshotId);
  const availableLocales = ALL_LOCALES.filter(l => !project.locales.includes(l.code));

  const handleAddLocale = (localeCode: string) => {
    addLocale(localeCode);
    setShowAddLocale(false);
  };

  const handleRemoveLocale = (localeCode: string) => {
    if (project.locales.length > 1 && localeCode !== project.defaultLocale) {
      removeLocale(localeCode);
      if (currentLocale === localeCode) {
        setCurrentLocale(project.defaultLocale);
      }
    }
  };

  const toggleScreenshotExpand = (screenshotId: string) => {
    setExpandedScreenshots(prev => {
      const newSet = new Set(prev);
      if (newSet.has(screenshotId)) {
        newSet.delete(screenshotId);
      } else {
        newSet.add(screenshotId);
      }
      return newSet;
    });
  };

  // Auto-translate using free translation API
  const handleAutoTranslate = async (targetLocale: string) => {
    if (!selectedScreenshot) return;

    setIsTranslating(true);
    setTranslatingLocale(targetLocale);

    try {
      // Get source texts from default locale
      const sourceLocale = project.defaultLocale;

      for (const text of selectedScreenshot.texts) {
        const sourceText = text.translations[sourceLocale];
        if (!sourceText) continue;

        // Use LibreTranslate or MyMemory (free APIs)
        try {
          const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(sourceText)}&langpair=${sourceLocale}|${targetLocale}`
          );
          const data = await response.json();

          if (data.responseData?.translatedText) {
            updateTextTranslation(
              selectedScreenshot.id,
              text.id,
              targetLocale,
              data.responseData.translatedText
            );
          }
        } catch (err) {
          console.error("Translation failed for text:", text.id, err);
        }
      }
    } catch (err) {
      console.error("Auto-translate failed:", err);
    } finally {
      setIsTranslating(false);
      setTranslatingLocale(null);
    }
  };

  // Auto-translate all locales
  const handleAutoTranslateAll = async () => {
    if (!selectedScreenshot) return;

    setIsTranslating(true);

    for (const localeCode of project.locales) {
      if (localeCode === project.defaultLocale) continue;
      setTranslatingLocale(localeCode);
      await handleAutoTranslate(localeCode);
    }

    setIsTranslating(false);
    setTranslatingLocale(null);
  };

  // Copy translations from one locale to another
  const handleCopyTranslations = (fromLocale: string, toLocale: string) => {
    if (!selectedScreenshot) return;

    for (const text of selectedScreenshot.texts) {
      const sourceText = text.translations[fromLocale];
      if (sourceText) {
        updateTextTranslation(selectedScreenshot.id, text.id, toLocale, sourceText);
      }
    }
  };

  return (
    <div className="border-t border-[#2c2c2e]">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-[#2c2c2e]/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#0a84ff]" />
          <span className="text-sm font-semibold text-[#f5f5f7]">Localization</span>
          <span className="px-1.5 py-0.5 text-[10px] font-medium bg-[#2c2c2e] text-[#8e8e93] rounded">
            {project.locales.length} languages
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-[#8e8e93]" />
        ) : (
          <ChevronRight className="w-4 h-4 text-[#8e8e93]" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Active Languages */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wide">
                Active Languages
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddLocale(!showAddLocale)}
                className="h-6 px-2 text-[10px]"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>

            <div className="space-y-1">
              {project.locales.map(localeCode => {
                const locale = ALL_LOCALES.find(l => l.code === localeCode);
                const isDefault = localeCode === project.defaultLocale;
                const isActive = localeCode === currentLocale;

                return (
                  <div
                    key={localeCode}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-[#0a84ff]/10 border border-[#0a84ff]/30"
                        : "hover:bg-[#2c2c2e] border border-transparent"
                    )}
                  >
                    <button
                      onClick={() => setCurrentLocale(localeCode)}
                      className="flex items-center gap-2 flex-1"
                    >
                      <span className="text-base">{locale?.flag}</span>
                      <div className="text-left">
                        <div className="text-xs font-medium text-[#f5f5f7]">
                          {locale?.name || localeCode}
                        </div>
                        <div className="text-[10px] text-[#8e8e93]">
                          {locale?.nativeName}
                        </div>
                      </div>
                      {isDefault && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase bg-[#30d158]/10 text-[#30d158] rounded">
                          Default
                        </span>
                      )}
                    </button>

                    <div className="flex items-center gap-1">
                      {!isDefault && (
                        <>
                          <button
                            onClick={() => handleAutoTranslate(localeCode)}
                            disabled={isTranslating}
                            className="p-1.5 rounded-md hover:bg-[#3a3a3c] text-[#8e8e93] hover:text-[#0a84ff] transition-colors"
                            title="Auto-translate"
                          >
                            {isTranslating && translatingLocale === localeCode ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Wand2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleCopyTranslations(project.defaultLocale, localeCode)}
                            className="p-1.5 rounded-md hover:bg-[#3a3a3c] text-[#8e8e93] hover:text-[#f5f5f7] transition-colors"
                            title="Copy from default"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleRemoveLocale(localeCode)}
                            className="p-1.5 rounded-md hover:bg-[#ff453a]/10 text-[#8e8e93] hover:text-[#ff453a] transition-colors"
                            title="Remove language"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      {!isDefault && (
                        <button
                          onClick={() => setDefaultLocale(localeCode)}
                          className="p-1.5 rounded-md hover:bg-[#3a3a3c] text-[#8e8e93] hover:text-[#30d158] transition-colors"
                          title="Set as default"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Language Dropdown */}
          {showAddLocale && (
            <div className="border border-[#3a3a3c] rounded-xl bg-[#2c2c2e] p-2 max-h-48 overflow-y-auto">
              <div className="text-[10px] font-semibold text-[#8e8e93] uppercase tracking-wide px-2 py-1 mb-1">
                Add Language
              </div>
              {availableLocales.map(locale => (
                <button
                  key={locale.code}
                  onClick={() => handleAddLocale(locale.code)}
                  className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-[#3a3a3c] transition-colors"
                >
                  <span className="text-base">{locale.flag}</span>
                  <div className="text-left">
                    <div className="text-xs font-medium text-[#f5f5f7]">{locale.name}</div>
                    <div className="text-[10px] text-[#8e8e93]">{locale.nativeName}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Auto-translate All Button */}
          {project.locales.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAutoTranslateAll}
              disabled={isTranslating}
              className="w-full gap-2"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Translating {translatingLocale}...
                </>
              ) : (
                <>
                  <Languages className="w-4 h-4" />
                  Auto-translate All Languages
                </>
              )}
            </Button>
          )}

          {/* Translation Editor */}
          {selectedScreenshot && (
            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wide">
                Translations for Screenshot {selectedScreenshot.order + 1}
              </div>

              {selectedScreenshot.texts.map(text => (
                <div
                  key={text.id}
                  className="border border-[#3a3a3c] rounded-lg overflow-hidden"
                >
                  <div className="px-3 py-2 bg-[#2c2c2e] flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-[#8e8e93] uppercase">
                      {text.type}
                    </span>
                  </div>

                  <div className="p-2 space-y-2">
                    {project.locales.map(localeCode => {
                      const locale = ALL_LOCALES.find(l => l.code === localeCode);
                      const translation = text.translations[localeCode] || "";
                      const isActive = localeCode === currentLocale;

                      return (
                        <div key={localeCode} className="flex items-start gap-2">
                          <span className="text-sm mt-1.5 flex-shrink-0" title={locale?.name}>
                            {locale?.flag}
                          </span>
                          <input
                            type="text"
                            value={translation}
                            onChange={(e) =>
                              updateTextTranslation(
                                selectedScreenshot.id,
                                text.id,
                                localeCode,
                                e.target.value
                              )
                            }
                            placeholder={`Enter ${locale?.name || localeCode} translation...`}
                            className={cn(
                              "flex-1 px-2 py-1.5 text-xs rounded-md border bg-[#1c1c1e] text-[#f5f5f7] placeholder:text-[#636366] focus:outline-none focus:ring-1 focus:ring-[#0a84ff]",
                              isActive ? "border-[#0a84ff]/30" : "border-[#3a3a3c]"
                            )}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
