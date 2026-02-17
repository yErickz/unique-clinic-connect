import { useState, useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ZoomIn, RotateCw } from "lucide-react";

const ASPECT_OPTIONS = [
  { label: "16:9", value: 16 / 9 },
  { label: "4:3", value: 4 / 3 },
  { label: "1:1", value: 1 },
] as const;

interface ImageCropDialogProps {
  open: boolean;
  imageSrc: string;
  aspect?: number;
  outputFormat?: "image/jpeg" | "image/png";
  onClose: () => void;
  onConfirm: (croppedBlob: Blob) => void;
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area, format: "image/jpeg" | "image/png" = "image/jpeg"): Promise<Blob> {
  const image = new Image();
  image.crossOrigin = "anonymous";
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = reject;
    image.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d")!;

  if (format === "image/png") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))),
      format,
      format === "image/jpeg" ? 0.9 : undefined,
    );
  });
}

const ImageCropDialog = ({ open, imageSrc, aspect: defaultAspect = 16 / 9, outputFormat = "image/jpeg", onClose, onConfirm }: ImageCropDialogProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState(defaultAspect);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels, outputFormat);
      onConfirm(blob);
    } catch {
      // fallback: pass original
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Recortar imagem</DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-[300px] sm:h-[350px] bg-muted rounded-lg overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground shrink-0">Proporção</span>
            <ToggleGroup
              type="single"
              value={String(aspect)}
              onValueChange={(v) => v && setAspect(Number(v))}
              className="gap-1"
            >
              {ASPECT_OPTIONS.map((opt) => (
                <ToggleGroupItem
                  key={opt.label}
                  value={String(opt.value)}
                  size="sm"
                  className="text-xs px-3"
                >
                  {opt.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div className="flex items-center gap-3">
            <ZoomIn size={16} className="text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground w-10 shrink-0">Zoom</span>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.05}
              onValueChange={([v]) => setZoom(v)}
              className="flex-1"
            />
          </div>
          <div className="flex items-center gap-3">
            <RotateCw size={16} className="text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground w-10 shrink-0">Girar</span>
            <Slider
              value={[rotation]}
              min={0}
              max={360}
              step={1}
              onValueChange={([v]) => setRotation(v)}
              className="flex-1"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isProcessing || !croppedAreaPixels}>
            {isProcessing ? "Processando..." : "Confirmar recorte"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropDialog;
