"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, ImageIcon, Type, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { useEditorStore } from "@/lib/store";
import { uploadApi } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface UploadedImage {
  file: File;
  preview: string;
  url?: string;
  uploading: boolean;
  uploaded: boolean;
  error?: string;
  headline: string;
  subtitle: string;
}

export function BulkImportDialog() {
  const {
    showBulkImportDialog,
    setShowBulkImportDialog,
    bulkImportScreenshots,
    currentLocale,
  } = useEditorStore();

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [bulkHeadlines, setBulkHeadlines] = useState("");
  const [bulkSubtitles, setBulkSubtitles] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
      uploaded: false,
      headline: "",
      subtitle: "",
    }));
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  // Parse bulk text input (one per line) - handles both newlines and tab-separated (Excel)
  const parseBulkText = (text: string): string[] => {
    // First try splitting by newlines, if only 1 result try tabs (Excel horizontal copy)
    let lines = text.split('\n').map(line => line.trim());
    if (lines.length === 1 && text.includes('\t')) {
      lines = text.split('\t').map(line => line.trim());
    }
    return lines.filter(line => line.length > 0);
  };

  // Auto-apply headlines when pasting/typing - like Excel
  const handleHeadlinesChange = (text: string) => {
    setBulkHeadlines(text);
    const headlines = parseBulkText(text);
    if (headlines.length > 0) {
      setImages(prev => prev.map((img, idx) => ({
        ...img,
        headline: headlines[idx] !== undefined ? headlines[idx] : img.headline,
      })));
    }
  };

  // Auto-apply subtitles when pasting/typing - like Excel
  const handleSubtitlesChange = (text: string) => {
    setBulkSubtitles(text);
    const subtitles = parseBulkText(text);
    if (subtitles.length > 0) {
      setImages(prev => prev.map((img, idx) => ({
        ...img,
        subtitle: subtitles[idx] !== undefined ? subtitles[idx] : img.subtitle,
      })));
    }
  };

  // Update individual image headline
  const updateImageHeadline = (index: number, headline: string) => {
    setImages(prev => prev.map((img, idx) =>
      idx === index ? { ...img, headline } : img
    ));
  };

  // Update individual image subtitle
  const updateImageSubtitle = (index: number, subtitle: string) => {
    setImages(prev => prev.map((img, idx) =>
      idx === index ? { ...img, subtitle } : img
    ));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
    },
    multiple: true,
  });

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleImport = async () => {
    // Check that all images have headlines
    const allHaveHeadlines = images.every(img => img.headline.trim());
    if (images.length === 0 || !allHaveHeadlines) return;

    setIsImporting(true);

    try {
      // Upload all images
      const uploadedImages: { url: string; filename: string; headline: string; subtitle: string }[] = [];

      for (let i = 0; i < images.length; i++) {
        setImages((prev) =>
          prev.map((img, idx) =>
            idx === i ? { ...img, uploading: true } : img
          )
        );

        try {
          const result = await uploadApi.upload(images[i].file);
          uploadedImages.push({
            url: result.url,
            filename: images[i].file.name,
            headline: images[i].headline,
            subtitle: images[i].subtitle,
          });

          setImages((prev) =>
            prev.map((img, idx) =>
              idx === i ? { ...img, uploading: false, uploaded: true, url: result.url } : img
            )
          );
        } catch (error) {
          setImages((prev) =>
            prev.map((img, idx) =>
              idx === i ? { ...img, uploading: false, error: "Upload failed" } : img
            )
          );
        }
      }

      // Create screenshots with the uploaded images
      if (uploadedImages.length > 0) {
        bulkImportScreenshots(uploadedImages);

        // Clean up
        images.forEach((img) => URL.revokeObjectURL(img.preview));
        setImages([]);
        setBulkHeadlines("");
        setBulkSubtitles("");
      }
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    if (!isImporting) {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
      setImages([]);
      setBulkHeadlines("");
      setBulkSubtitles("");
      setShowBulkImportDialog(false);
    }
  };

  const allUploaded = images.length > 0 && images.every((img) => img.uploaded);
  const allHaveHeadlines = images.every(img => img.headline.trim());
  const canImport = images.length > 0 && allHaveHeadlines && !isImporting;
  const missingHeadlinesCount = images.filter(img => !img.headline.trim()).length;

  return (
    <Dialog open={showBulkImportDialog} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#30d158] to-[#34c759] flex items-center justify-center">
              <Upload className="w-5 h-5 text-white" />
            </div>
            Bulk Import Screenshots
          </DialogTitle>
          <DialogDescription>
            Upload multiple screenshots and import headlines/subtitles in bulk (one per line)
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-4">
          {/* Drop Zone */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="w-4 h-4 text-[#8e8e93]" />
              <Label className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wide">
                Screenshots ({images.length})
              </Label>
            </div>

            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300",
                isDragActive
                  ? "border-[#0a84ff] bg-[#0a84ff]/10"
                  : "border-[#3a3a3c] hover:border-[#0a84ff] hover:bg-[#2c2c2e]"
              )}
            >
              <input {...getInputProps()} />
              <div className={cn(
                "w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300",
                isDragActive ? "bg-[#0a84ff] scale-110" : "bg-[#2c2c2e]"
              )}>
                <Upload className={cn(
                  "w-7 h-7",
                  isDragActive ? "text-white" : "text-[#8e8e93]"
                )} />
              </div>
              <p className="text-sm font-medium text-[#f5f5f7]">
                {isDragActive ? "Drop screenshots here" : "Drag & drop screenshots"}
              </p>
              <p className="text-xs text-[#8e8e93] mt-1">
                or click to browse (PNG, JPG, WebP)
              </p>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-5 gap-3 mt-4">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-[9/19.5] rounded-xl overflow-hidden bg-[#2c2c2e] group animate-fadeInScale"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <img
                      src={img.preview}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Status overlay */}
                    {(img.uploading || img.uploaded || img.error) && (
                      <div className={cn(
                        "absolute inset-0 flex items-center justify-center",
                        img.uploading && "bg-black/50",
                        img.uploaded && "bg-[#30d158]/20",
                        img.error && "bg-[#ff453a]/20"
                      )}>
                        {img.uploading && <Loader2 className="w-6 h-6 text-white animate-spin" />}
                        {img.uploaded && <CheckCircle2 className="w-6 h-6 text-[#30d158]" />}
                        {img.error && <X className="w-6 h-6 text-[#ff453a]" />}
                      </div>
                    )}

                    {/* Remove button */}
                    {!isImporting && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}

                    {/* Index badge */}
                    <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/60 text-white">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bulk Text Import */}
          {images.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Type className="w-4 h-4 text-[#8e8e93]" />
                <Label className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wide">
                  Bulk Text Import (one per line)
                </Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-[#f5f5f7] mb-1.5 block">
                    Headlines <span className="text-[#ff453a]">*</span>
                  </Label>
                  <Textarea
                    value={bulkHeadlines}
                    onChange={(e) => handleHeadlinesChange(e.target.value)}
                    placeholder={`Paste headlines here (one per line):\nHeadline 1\nHeadline 2\nHeadline 3\n...`}
                    className="h-24 text-sm resize-none"
                    disabled={isImporting}
                  />
                  <p className="text-[11px] text-[#8e8e93] mt-1.5">
                    {parseBulkText(bulkHeadlines).length} of {images.length} headlines • Auto-applies on paste
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-[#f5f5f7] mb-1.5 block">
                    Subtitles (optional)
                  </Label>
                  <Textarea
                    value={bulkSubtitles}
                    onChange={(e) => handleSubtitlesChange(e.target.value)}
                    placeholder={`Paste subtitles here (one per line):\nSubtitle 1\nSubtitle 2\nSubtitle 3\n...`}
                    className="h-24 text-sm resize-none"
                    disabled={isImporting}
                  />
                  <p className="text-[11px] text-[#8e8e93] mt-1.5">
                    {parseBulkText(bulkSubtitles).length} of {images.length} subtitles • Auto-applies on paste
                  </p>
                </div>
              </div>

              {/* Per-screenshot preview with editable fields */}
              <div className="space-y-2 mt-4">
                <Label className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wide">
                  Per-Screenshot Text Preview
                </Label>
                <div className="max-h-48 overflow-y-auto space-y-2 rounded-xl bg-[#1c1c1e] p-3">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex gap-3 p-2 rounded-lg",
                        img.headline.trim() ? "bg-[#2c2c2e]" : "bg-[#2c2c2e] border border-[#ff453a]/30"
                      )}
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-md overflow-hidden bg-[#3a3a3c]">
                        <img
                          src={img.preview}
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#8e8e93] w-4">{index + 1}</span>
                          <Input
                            value={img.headline}
                            onChange={(e) => updateImageHeadline(index, e.target.value)}
                            placeholder="Headline *"
                            className="h-7 text-xs flex-1"
                            disabled={isImporting}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-4" />
                          <Input
                            value={img.subtitle}
                            onChange={(e) => updateImageSubtitle(index, e.target.value)}
                            placeholder="Subtitle (optional)"
                            className="h-7 text-xs flex-1"
                            disabled={isImporting}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          {images.length > 0 && (
            <div className={cn(
              "rounded-xl bg-gradient-to-br p-4 border",
              allHaveHeadlines
                ? "from-[#2c2c2e] to-[#1c1c1e] border-[#3a3a3c]"
                : "from-[#ff453a]/10 to-[#1c1c1e] border-[#ff453a]/30"
            )}>
              <div className="flex items-center gap-3">
                <Sparkles className={cn("w-5 h-5", allHaveHeadlines ? "text-[#0a84ff]" : "text-[#ff453a]")} />
                <div>
                  <p className="text-sm font-medium text-[#f5f5f7]">
                    {allHaveHeadlines
                      ? `Ready to create ${images.length} screenshot${images.length > 1 ? "s" : ""}`
                      : `${missingHeadlinesCount} screenshot${missingHeadlinesCount > 1 ? "s" : ""} missing headline`}
                  </p>
                  <p className="text-xs text-[#8e8e93]">
                    {allHaveHeadlines
                      ? "Each screenshot will have its own headline and subtitle"
                      : "Add headlines for all screenshots to continue"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isImporting}
          >
            Cancel
          </Button>
          <Button
            variant="premium"
            onClick={handleImport}
            disabled={!canImport}
            className="gap-2"
          >
            {isImporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Import {images.length} Screenshot{images.length !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
