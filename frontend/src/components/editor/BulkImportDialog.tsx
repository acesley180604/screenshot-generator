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
import { cn } from "@/lib/utils";

interface UploadedImage {
  file: File;
  preview: string;
  url?: string;
  uploading: boolean;
  uploaded: boolean;
  error?: string;
}

export function BulkImportDialog() {
  const {
    showBulkImportDialog,
    setShowBulkImportDialog,
    bulkImportScreenshots,
    currentLocale,
  } = useEditorStore();

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [headline, setHeadline] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
      uploaded: false,
    }));
    setImages((prev) => [...prev, ...newImages]);
  }, []);

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
    if (images.length === 0 || !headline.trim()) return;

    setIsImporting(true);

    try {
      // Upload all images
      const uploadedImages: { url: string; filename: string }[] = [];

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
        bulkImportScreenshots(uploadedImages, headline, subtitle || undefined);

        // Clean up
        images.forEach((img) => URL.revokeObjectURL(img.preview));
        setImages([]);
        setHeadline("");
        setSubtitle("");
      }
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    if (!isImporting) {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
      setImages([]);
      setHeadline("");
      setSubtitle("");
      setShowBulkImportDialog(false);
    }
  };

  const allUploaded = images.length > 0 && images.every((img) => img.uploaded);
  const canImport = images.length > 0 && headline.trim() && !isImporting;

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
            Upload multiple screenshots at once and set a shared headline for all
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

          {/* Text Input */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Type className="w-4 h-4 text-[#8e8e93]" />
              <Label className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wide">
                Shared Text (applies to all)
              </Label>
            </div>

            <div>
              <Label className="text-sm font-medium text-[#f5f5f7] mb-1.5 block">
                Headline <span className="text-[#ff453a]">*</span>
              </Label>
              <Input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Enter headline for all screenshots..."
                className="h-11 text-base"
                disabled={isImporting}
              />
              <p className="text-[11px] text-[#8e8e93] mt-1">
                This headline will be applied to all {images.length || 0} screenshots
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-[#f5f5f7] mb-1.5 block">
                Subtitle (optional)
              </Label>
              <Input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Enter optional subtitle..."
                className="h-10"
                disabled={isImporting}
              />
            </div>
          </div>

          {/* Summary */}
          {images.length > 0 && (
            <div className="rounded-xl bg-gradient-to-br from-[#2c2c2e] to-[#1c1c1e] p-4 border border-[#3a3a3c]">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#0a84ff]" />
                <div>
                  <p className="text-sm font-medium text-[#f5f5f7]">
                    Ready to create {images.length} screenshot{images.length > 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-[#8e8e93]">
                    Each will have the same headline and styling
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
