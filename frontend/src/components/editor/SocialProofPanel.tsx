"use client";

import React from "react";
import {
  Star,
  Download,
  Award,
  GraduationCap,
  Quote,
  Newspaper,
  Users,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  LayoutGrid,
} from "lucide-react";
import { useEditorStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { SocialProofType, SocialProofElement, FeatureCard, AvatarConfig } from "@/types";

// University logo data - popular universities with SVG-friendly icons
const UNIVERSITY_LOGOS = [
  { id: "harvard", name: "Harvard", shortName: "H" },
  { id: "stanford", name: "Stanford", shortName: "S" },
  { id: "mit", name: "MIT", shortName: "MIT" },
  { id: "yale", name: "Yale", shortName: "Y" },
  { id: "princeton", name: "Princeton", shortName: "P" },
  { id: "columbia", name: "Columbia", shortName: "C" },
  { id: "berkeley", name: "Berkeley", shortName: "B" },
  { id: "oxford", name: "Oxford", shortName: "Ox" },
  { id: "cambridge", name: "Cambridge", shortName: "Cam" },
  { id: "caltech", name: "Caltech", shortName: "Cal" },
];

// Press/media logos - expanded like Headspace
const PRESS_LOGOS = [
  { id: "nytimes", name: "The New York Times" },
  { id: "forbes", name: "Forbes" },
  { id: "bbc", name: "BBC" },
  { id: "wsj", name: "Wall Street Journal" },
  { id: "bloomberg", name: "Bloomberg" },
  { id: "techcrunch", name: "TechCrunch" },
  { id: "wired", name: "WIRED" },
  { id: "verge", name: "The Verge" },
  { id: "vogue", name: "VOGUE" },
  { id: "nbc", name: "NBC" },
  { id: "cnn", name: "CNN" },
  { id: "today", name: "TODAY" },
  { id: "ellen", name: "ellen" },
  { id: "producthunt", name: "Product Hunt" },
  { id: "mashable", name: "Mashable" },
  { id: "fastcompany", name: "Fast Company" },
  { id: "inc", name: "Inc." },
  { id: "entrepreneur", name: "Entrepreneur" },
];

// Social proof type configurations
const SOCIAL_PROOF_TYPES: {
  type: SocialProofType;
  icon: React.ElementType;
  label: string;
  description: string;
}[] = [
  {
    type: "rating",
    icon: Star,
    label: "App Rating",
    description: "Star rating with count",
  },
  {
    type: "downloads",
    icon: Download,
    label: "Downloads",
    description: "Download count badge",
  },
  {
    type: "award",
    icon: Award,
    label: "Award Badge",
    description: "Editor's Choice, App of the Day",
  },
  {
    type: "university",
    icon: GraduationCap,
    label: "University Logos",
    description: "Used at top universities",
  },
  {
    type: "testimonial",
    icon: Quote,
    label: "Testimonial",
    description: "User quote",
  },
  {
    type: "press",
    icon: Newspaper,
    label: "Press Mentions",
    description: "As seen in media",
  },
  {
    type: "trusted-by",
    icon: Users,
    label: "Trusted By",
    description: "User count badge",
  },
  {
    type: "feature-cards",
    icon: LayoutGrid,
    label: "Feature Cards",
    description: "Grid of feature highlights",
  },
];

// Default social proof element factory
function createDefaultSocialProof(type: SocialProofType): SocialProofElement {
  const base = {
    id: crypto.randomUUID(),
    type,
    enabled: true,
    positionY: 0.92,
    positionX: 0.5,
    style: {
      scale: 1,
      opacity: 1,
      color: "#FFFFFF",
      secondaryColor: "#FFD700",
    },
  };

  switch (type) {
    case "rating":
      return {
        ...base,
        rating: 4.8,
        ratingCount: "125K ratings",
        showStars: true,
      };
    case "downloads":
      return {
        ...base,
        downloadCount: "10M+",
      };
    case "award":
      return {
        ...base,
        awardType: "apple-design",
        awardText: "Apple Design Award",
        style: {
          ...base.style,
          color: "#1a1a1a",
          secondaryColor: "#FF6B00",
        },
      };
    case "university":
      return {
        ...base,
        logos: ["harvard", "stanford", "mit"],
        logosLabel: "Used by students at",
      };
    case "testimonial":
      return {
        ...base,
        testimonialText: "This app changed my life! Absolutely love it.",
        testimonialAuthor: "Sarah Johnson",
        testimonialRating: 5,
        testimonialStyle: "card",
        testimonialAvatar: {
          id: crypto.randomUUID(),
          initials: "SJ",
          color: "#6366f1",
        },
        positionY: 0.85,
        style: {
          ...base.style,
          color: "#1a1a2e",
          backgroundColor: "rgba(255,255,255,0.95)",
        },
      };
    case "press":
      return {
        ...base,
        pressLogos: ["nytimes", "forbes", "bbc", "vogue", "nbc", "today"],
        positionY: 0.5,
        style: {
          ...base.style,
          color: "#1a1a1a",
          secondaryColor: "#1a1a1a",
        },
      };
    case "trusted-by":
      return {
        ...base,
        downloadCount: "2M+",
        avatars: [
          { id: crypto.randomUUID(), initials: "JD", color: "#FF6B6B" },
          { id: crypto.randomUUID(), initials: "AS", color: "#4ECDC4" },
          { id: crypto.randomUUID(), initials: "MK", color: "#45B7D1" },
          { id: crypto.randomUUID(), initials: "RL", color: "#96CEB4" },
          { id: crypto.randomUUID(), initials: "TC", color: "#FFEAA7" },
        ],
        avatarOverflow: 99,
        avatarStyle: "stack",
        style: {
          ...base.style,
          color: "#1a1a2e",
          backgroundColor: "rgba(255,255,255,0.95)",
          borderColor: "#ffffff",
        },
      };
    case "feature-cards":
      return {
        ...base,
        positionY: 0.6,
        featureCards: [
          { id: crypto.randomUUID(), label: "Meditate", color: "#E85D04", iconType: "waves" },
          { id: crypto.randomUUID(), label: "Sleep", color: "#3D405B", iconType: "stars" },
          { id: crypto.randomUUID(), label: "Breathe", color: "#F4D35E", iconType: "circles" },
          { id: crypto.randomUUID(), label: "Focus", color: "#2563EB", iconType: "dots" },
          { id: crypto.randomUUID(), label: "Move", color: "#EC4899", iconType: "gradient" },
          { id: crypto.randomUUID(), label: "Relax", color: "#059669", iconType: "waves" },
        ],
        style: {
          ...base.style,
          scale: 1,
        },
      };
    default:
      return base;
  }
}

export function SocialProofPanel() {
  const {
    project,
    selectedScreenshotId,
    addSocialProof,
    updateSocialProof,
    removeSocialProof,
    toggleSocialProof,
    applySocialProofToAll,
  } = useEditorStore();

  const selectedScreenshot = project.screenshots.find(
    (s) => s.id === selectedScreenshotId
  );

  if (!selectedScreenshot) {
    return (
      <div className="p-4 text-center text-[#8e8e93] text-sm">
        Select a screenshot to add social proof elements
      </div>
    );
  }

  const socialProofElements = selectedScreenshot.socialProof || [];

  const handleAddSocialProof = (type: SocialProofType) => {
    const element = createDefaultSocialProof(type);
    addSocialProof(selectedScreenshot.id, element);
  };

  return (
    <div className="space-y-4">
      {/* Add Social Proof Section */}
      <div>
        <Label className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wide mb-3 block">
          Add Social Proof
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {SOCIAL_PROOF_TYPES.map(({ type, icon: Icon, label, description }) => (
            <button
              key={type}
              onClick={() => handleAddSocialProof(type)}
              className="flex items-start gap-2 p-2.5 rounded-xl bg-[#2c2c2e] hover:bg-[#3a3a3c] transition-colors text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#1c1c1e] flex items-center justify-center flex-shrink-0 group-hover:bg-[#0a84ff]/20 transition-colors">
                <Icon className="w-4 h-4 text-[#8e8e93] group-hover:text-[#0a84ff]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-[#f5f5f7] truncate">{label}</p>
                <p className="text-[10px] text-[#8e8e93] truncate">{description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Social Proof Elements */}
      {socialProofElements.length > 0 && (
        <div className="space-y-3">
          <Label className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wide">
            Active Elements ({socialProofElements.length})
          </Label>

          {socialProofElements.map((element) => (
            <SocialProofElementEditor
              key={element.id}
              element={element}
              screenshotId={selectedScreenshot.id}
              onUpdate={updateSocialProof}
              onRemove={removeSocialProof}
              onToggle={toggleSocialProof}
              onApplyToAll={applySocialProofToAll}
            />
          ))}
        </div>
      )}

      {socialProofElements.length === 0 && (
        <div className="rounded-xl bg-[#1c1c1e] p-4 text-center">
          <p className="text-sm text-[#8e8e93]">
            No social proof elements yet
          </p>
          <p className="text-xs text-[#636366] mt-1">
            Add ratings, awards, or university logos to build trust
          </p>
        </div>
      )}
    </div>
  );
}

// Individual social proof element editor
function SocialProofElementEditor({
  element,
  screenshotId,
  onUpdate,
  onRemove,
  onToggle,
  onApplyToAll,
}: {
  element: SocialProofElement;
  screenshotId: string;
  onUpdate: (screenshotId: string, elementId: string, updates: Partial<SocialProofElement>) => void;
  onRemove: (screenshotId: string, elementId: string) => void;
  onToggle: (screenshotId: string, elementId: string) => void;
  onApplyToAll: (element: SocialProofElement) => void;
}) {
  const typeConfig = SOCIAL_PROOF_TYPES.find((t) => t.type === element.type);
  const Icon = typeConfig?.icon || Star;

  return (
    <div
      className={cn(
        "rounded-xl border p-3 space-y-3 transition-all",
        element.enabled
          ? "bg-[#2c2c2e] border-[#3a3a3c]"
          : "bg-[#1c1c1e] border-[#2c2c2e] opacity-60"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-[#0a84ff]" />
          <span className="text-sm font-medium text-[#f5f5f7]">
            {typeConfig?.label}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggle(screenshotId, element.id)}
            className="p-1.5 rounded-lg hover:bg-[#3a3a3c] transition-colors"
          >
            {element.enabled ? (
              <Eye className="w-4 h-4 text-[#30d158]" />
            ) : (
              <EyeOff className="w-4 h-4 text-[#8e8e93]" />
            )}
          </button>
          <button
            onClick={() => onRemove(screenshotId, element.id)}
            className="p-1.5 rounded-lg hover:bg-[#ff453a]/20 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-[#ff453a]" />
          </button>
        </div>
      </div>

      {/* Type-specific controls */}
      {element.type === "rating" && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[10px] text-[#8e8e93]">Rating</Label>
              <Input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={element.rating || 4.8}
                onChange={(e) =>
                  onUpdate(screenshotId, element.id, {
                    rating: parseFloat(e.target.value),
                  })
                }
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label className="text-[10px] text-[#8e8e93]">Count</Label>
              <Input
                value={element.ratingCount || ""}
                onChange={(e) =>
                  onUpdate(screenshotId, element.id, {
                    ratingCount: e.target.value,
                  })
                }
                placeholder="125K ratings"
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {element.type === "downloads" && (
        <div>
          <Label className="text-[10px] text-[#8e8e93]">Download Count</Label>
          <Input
            value={element.downloadCount || ""}
            onChange={(e) =>
              onUpdate(screenshotId, element.id, {
                downloadCount: e.target.value,
              })
            }
            placeholder="10M+ downloads"
            className="h-8 text-xs"
          />
        </div>
      )}

      {element.type === "award" && (
        <div className="space-y-2">
          <div>
            <Label className="text-[10px] text-[#8e8e93]">Award Type</Label>
            <Select
              value={element.awardType || "apple-design"}
              onValueChange={(value) =>
                onUpdate(screenshotId, element.id, {
                  awardType: value as SocialProofElement["awardType"],
                  awardText:
                    value === "apple-design"
                      ? "Apple Design Award"
                      : value === "editors-choice"
                      ? "Editor's Choice"
                      : value === "app-of-the-day"
                      ? "App of the Day"
                      : value === "best-of-year"
                      ? "Best of 2024"
                      : value === "webby"
                      ? "The Webby Awards"
                      : element.awardText,
                })
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple-design">Apple Design Award</SelectItem>
                <SelectItem value="webby">The Webby Awards</SelectItem>
                <SelectItem value="editors-choice">Editor's Choice</SelectItem>
                <SelectItem value="app-of-the-day">App of the Day</SelectItem>
                <SelectItem value="best-of-year">Best of Year</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {element.awardType === "custom" && (
            <div>
              <Label className="text-[10px] text-[#8e8e93]">Custom Text</Label>
              <Input
                value={element.awardText || ""}
                onChange={(e) =>
                  onUpdate(screenshotId, element.id, {
                    awardText: e.target.value,
                  })
                }
                placeholder="Award text..."
                className="h-8 text-xs"
              />
            </div>
          )}
        </div>
      )}

      {element.type === "university" && (
        <div className="space-y-2">
          <div>
            <Label className="text-[10px] text-[#8e8e93]">Label</Label>
            <Input
              value={element.logosLabel || ""}
              onChange={(e) =>
                onUpdate(screenshotId, element.id, {
                  logosLabel: e.target.value,
                })
              }
              placeholder="Used by students at"
              className="h-8 text-xs"
            />
          </div>
          <div>
            <Label className="text-[10px] text-[#8e8e93] mb-1.5 block">
              Universities
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {UNIVERSITY_LOGOS.map((uni) => {
                const isSelected = element.logos?.includes(uni.id);
                return (
                  <button
                    key={uni.id}
                    onClick={() => {
                      const current = element.logos || [];
                      const updated = isSelected
                        ? current.filter((id) => id !== uni.id)
                        : [...current, uni.id];
                      onUpdate(screenshotId, element.id, { logos: updated });
                    }}
                    className={cn(
                      "px-2 py-1 rounded-lg text-[10px] font-medium transition-all",
                      isSelected
                        ? "bg-[#0a84ff] text-white"
                        : "bg-[#1c1c1e] text-[#8e8e93] hover:bg-[#3a3a3c]"
                    )}
                  >
                    {uni.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {element.type === "testimonial" && (
        <div className="space-y-2">
          {/* Style selector */}
          <div>
            <Label className="text-[10px] text-[#8e8e93]">Style</Label>
            <Select
              value={element.testimonialStyle || "card"}
              onValueChange={(value) =>
                onUpdate(screenshotId, element.id, {
                  testimonialStyle: value as "card" | "quote" | "bubble",
                })
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Card with Avatar</SelectItem>
                <SelectItem value="bubble">Speech Bubble</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-[10px] text-[#8e8e93]">Quote</Label>
            <Input
              value={element.testimonialText || ""}
              onChange={(e) =>
                onUpdate(screenshotId, element.id, {
                  testimonialText: e.target.value,
                })
              }
              placeholder="This app changed my life!"
              className="h-8 text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[10px] text-[#8e8e93]">Author</Label>
              <Input
                value={element.testimonialAuthor || ""}
                onChange={(e) => {
                  const name = e.target.value;
                  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
                  onUpdate(screenshotId, element.id, {
                    testimonialAuthor: name,
                    testimonialAvatar: {
                      ...(element.testimonialAvatar || { id: crypto.randomUUID() }),
                      initials: initials || "?",
                    },
                  });
                }}
                placeholder="Sarah Johnson"
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label className="text-[10px] text-[#8e8e93]">Rating</Label>
              <Select
                value={String(element.testimonialRating ?? 5)}
                onValueChange={(value) =>
                  onUpdate(screenshotId, element.id, {
                    testimonialRating: parseInt(value),
                  })
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((r) => (
                    <SelectItem key={r} value={String(r)}>
                      {"★".repeat(r)}{"☆".repeat(5-r)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Avatar color */}
          <div>
            <Label className="text-[10px] text-[#8e8e93]">Avatar Color</Label>
            <div className="flex gap-2 mt-1">
              {["#6366f1", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#F4A460"].map((color) => (
                <button
                  key={color}
                  onClick={() =>
                    onUpdate(screenshotId, element.id, {
                      testimonialAvatar: {
                        ...(element.testimonialAvatar || { id: crypto.randomUUID(), initials: "JD" }),
                        color,
                      },
                    })
                  }
                  className={cn(
                    "w-6 h-6 rounded-full border-2 transition-all",
                    element.testimonialAvatar?.color === color ? "border-white scale-110" : "border-transparent"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          {/* Avatar image URL */}
          <div>
            <Label className="text-[10px] text-[#8e8e93]">Avatar Image URL (optional)</Label>
            <Input
              value={element.testimonialAvatar?.imageUrl || ""}
              onChange={(e) =>
                onUpdate(screenshotId, element.id, {
                  testimonialAvatar: {
                    ...(element.testimonialAvatar || { id: crypto.randomUUID(), initials: "JD", color: "#6366f1" }),
                    imageUrl: e.target.value || undefined,
                  },
                })
              }
              placeholder="https://example.com/photo.jpg"
              className="h-8 text-xs"
            />
          </div>
        </div>
      )}

      {element.type === "press" && (
        <div>
          <Label className="text-[10px] text-[#8e8e93] mb-1.5 block">
            Media Outlets
          </Label>
          <div className="flex flex-wrap gap-1.5">
            {PRESS_LOGOS.map((press) => {
              const isSelected = element.pressLogos?.includes(press.id);
              return (
                <button
                  key={press.id}
                  onClick={() => {
                    const current = element.pressLogos || [];
                    const updated = isSelected
                      ? current.filter((id) => id !== press.id)
                      : [...current, press.id];
                    onUpdate(screenshotId, element.id, { pressLogos: updated });
                  }}
                  className={cn(
                    "px-2 py-1 rounded-lg text-[10px] font-medium transition-all",
                    isSelected
                      ? "bg-[#0a84ff] text-white"
                      : "bg-[#1c1c1e] text-[#8e8e93] hover:bg-[#3a3a3c]"
                  )}
                >
                  {press.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {element.type === "trusted-by" && (
        <div className="space-y-3">
          <div>
            <Label className="text-[10px] text-[#8e8e93]">User Count</Label>
            <Input
              value={element.downloadCount || ""}
              onChange={(e) =>
                onUpdate(screenshotId, element.id, {
                  downloadCount: e.target.value,
                })
              }
              placeholder="2M+"
              className="h-8 text-xs"
            />
          </div>
          <div>
            <Label className="text-[10px] text-[#8e8e93]">Overflow Count (+N)</Label>
            <Input
              type="number"
              min="0"
              max="999"
              value={element.avatarOverflow ?? 99}
              onChange={(e) =>
                onUpdate(screenshotId, element.id, {
                  avatarOverflow: parseInt(e.target.value) || 0,
                })
              }
              placeholder="99"
              className="h-8 text-xs"
            />
          </div>
          {/* Avatar management */}
          <div>
            <Label className="text-[10px] text-[#8e8e93] mb-2 block">
              Avatars ({element.avatars?.length || 0}/5)
            </Label>
            <div className="space-y-2">
              {(element.avatars || []).slice(0, 5).map((avatar, idx) => (
                <div key={avatar.id} className="flex items-center gap-2 p-2 bg-[#1c1c1e] rounded-lg">
                  <input
                    type="color"
                    value={avatar.color || "#6366f1"}
                    onChange={(e) => {
                      const updated = [...(element.avatars || [])];
                      updated[idx] = { ...avatar, color: e.target.value };
                      onUpdate(screenshotId, element.id, { avatars: updated });
                    }}
                    className="w-6 h-6 rounded-full cursor-pointer border-0"
                  />
                  <Input
                    value={avatar.initials || ""}
                    onChange={(e) => {
                      const updated = [...(element.avatars || [])];
                      updated[idx] = { ...avatar, initials: e.target.value.slice(0, 2).toUpperCase() };
                      onUpdate(screenshotId, element.id, { avatars: updated });
                    }}
                    className="h-7 text-xs w-12"
                    placeholder="JD"
                    maxLength={2}
                  />
                  <Input
                    value={avatar.imageUrl || ""}
                    onChange={(e) => {
                      const updated = [...(element.avatars || [])];
                      updated[idx] = { ...avatar, imageUrl: e.target.value || undefined };
                      onUpdate(screenshotId, element.id, { avatars: updated });
                    }}
                    className="h-7 text-xs flex-1"
                    placeholder="Image URL (optional)"
                  />
                  <button
                    onClick={() => {
                      const updated = (element.avatars || []).filter((_, i) => i !== idx);
                      onUpdate(screenshotId, element.id, { avatars: updated });
                    }}
                    className="p-1 hover:bg-[#ff453a]/20 rounded"
                  >
                    <Trash2 className="w-3 h-3 text-[#ff453a]" />
                  </button>
                </div>
              ))}
            </div>
            {(element.avatars?.length || 0) < 5 && (
              <Button
                variant="outline"
                size="sm"
                className="w-full h-7 text-[10px] mt-2"
                onClick={() => {
                  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"];
                  const newAvatar: AvatarConfig = {
                    id: crypto.randomUUID(),
                    initials: "??",
                    color: colors[Math.floor(Math.random() * colors.length)],
                  };
                  onUpdate(screenshotId, element.id, {
                    avatars: [...(element.avatars || []), newAvatar],
                  });
                }}
              >
                <Plus className="w-3 h-3 mr-1" /> Add Avatar
              </Button>
            )}
          </div>
        </div>
      )}

      {element.type === "feature-cards" && (
        <div className="space-y-3">
          <Label className="text-[10px] text-[#8e8e93] block">
            Feature Cards ({element.featureCards?.length || 0})
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {(element.featureCards || []).map((card, idx) => (
              <div key={card.id} className="flex items-center gap-2 p-2 bg-[#1c1c1e] rounded-lg">
                <input
                  type="color"
                  value={card.color}
                  onChange={(e) => {
                    const updated = [...(element.featureCards || [])];
                    updated[idx] = { ...card, color: e.target.value };
                    onUpdate(screenshotId, element.id, { featureCards: updated });
                  }}
                  className="w-6 h-6 rounded cursor-pointer border-0"
                />
                <Input
                  value={card.label}
                  onChange={(e) => {
                    const updated = [...(element.featureCards || [])];
                    updated[idx] = { ...card, label: e.target.value };
                    onUpdate(screenshotId, element.id, { featureCards: updated });
                  }}
                  className="h-7 text-xs flex-1"
                  placeholder="Feature name"
                />
                <button
                  onClick={() => {
                    const updated = (element.featureCards || []).filter((_, i) => i !== idx);
                    onUpdate(screenshotId, element.id, { featureCards: updated });
                  }}
                  className="p-1 hover:bg-[#ff453a]/20 rounded"
                >
                  <Trash2 className="w-3 h-3 text-[#ff453a]" />
                </button>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full h-7 text-[10px]"
            onClick={() => {
              const newCard: FeatureCard = {
                id: crypto.randomUUID(),
                label: "New Feature",
                color: "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
                iconType: "dots",
              };
              onUpdate(screenshotId, element.id, {
                featureCards: [...(element.featureCards || []), newCard],
              });
            }}
          >
            <Plus className="w-3 h-3 mr-1" /> Add Card
          </Button>
        </div>
      )}

      {/* Position controls */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-[10px] text-[#8e8e93]">Position Y</Label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={element.positionY}
            onChange={(e) =>
              onUpdate(screenshotId, element.id, {
                positionY: parseFloat(e.target.value),
              })
            }
            className="w-full h-1.5 bg-[#3a3a3c] rounded-full appearance-none cursor-pointer"
          />
        </div>
        <div>
          <Label className="text-[10px] text-[#8e8e93]">Scale</Label>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={element.style.scale}
            onChange={(e) =>
              onUpdate(screenshotId, element.id, {
                style: { ...element.style, scale: parseFloat(e.target.value) },
              })
            }
            className="w-full h-1.5 bg-[#3a3a3c] rounded-full appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Apply to all button */}
      <Button
        variant="outline"
        size="sm"
        className="w-full h-7 text-[10px]"
        onClick={() => onApplyToAll(element)}
      >
        Apply to All Screenshots
      </Button>
    </div>
  );
}
