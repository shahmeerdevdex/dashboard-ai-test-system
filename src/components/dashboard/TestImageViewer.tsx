import { useState } from "react";
import { X, ZoomIn, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TestImageViewerProps {
  images: {
    startImage: string;
    endImage: string;
  };
  userName: string;
  testDate: string;
}

export function TestImageViewer({ images, userName, testDate }: TestImageViewerProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const hasValidImage = (imageUrl: string) => {
    if (!imageUrl || imageUrl.trim() === "") return false;

    // Check for Unsplash placeholder URLs
    if (imageUrl.includes("unsplash.com/photo-1494790108755-2616c5e8f0c2")) return false;

    // Check for other common placeholder patterns
    if (imageUrl.includes("placeholder") || imageUrl.includes("default")) return false;

    return true;
  };

  const ImagePlaceholder = ({ label }: { label: string }) => (
    <div className="w-full h-96 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
      <ImageIcon className="w-16 h-16 text-gray-400 mb-3" />
      <p className="text-sm text-gray-500 font-medium">No {label} Available</p>
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Start Image</p>
          {hasValidImage(images.startImage) ? (
            <div
              className="relative group cursor-pointer"
              onClick={() => setSelectedImage(images.startImage)}>
              <img
                src={images.startImage}
                alt="Test start"
                className="w-full h-96 object-cover rounded-lg border"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <ZoomIn className="w-6 h-6 text-white" />
              </div>
            </div>
          ) : (
            <ImagePlaceholder label="Start Image" />
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">End Image</p>
          {hasValidImage(images.endImage) ? (
            <div
              className="relative group cursor-pointer"
              onClick={() => setSelectedImage(images.endImage)}>
              <img
                src={images.endImage}
                alt="Test end"
                className="w-full h-96 object-cover rounded-lg border"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <ZoomIn className="w-6 h-6 text-white" />
              </div>
            </div>
          ) : (
            <ImagePlaceholder label="End Image" />
          )}
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {userName} - {testDate}
            </DialogTitle>
          </DialogHeader>
          <div className="relative">
            <img
              src={selectedImage || ""}
              alt="Test image"
              className="w-full max-h-96 object-contain rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
