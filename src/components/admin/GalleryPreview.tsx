import { Building2 } from "lucide-react";

interface GallerySpace {
  label: string;
  description: string;
  image_url?: string;
  span: string;
}

const gradients = [
  "from-primary/15 to-accent/10",
  "from-accent/15 to-primary/10",
  "from-primary/10 to-accent/15",
  "from-accent/10 to-primary/15",
  "from-primary/15 to-accent/10",
];

const GalleryPreview = ({ spaces }: { spaces: GallerySpace[] }) => {
  if (spaces.length === 0) {
    return (
      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground text-sm">
        Adicione espaços acima para visualizar
      </div>
    );
  }

  return (
    <div className="border-2 border-dashed border-primary/30 rounded-lg p-3 bg-muted/20">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">
        Preview
      </span>
      <div className="grid grid-cols-3 auto-rows-[180px] gap-3">
        {spaces.map((space, i) => {
          const spanClass =
            space.span === "wide"
              ? "col-span-2 row-span-1"
              : space.span === "vertical"
              ? "col-span-1 row-span-2"
              : "col-span-1 row-span-1";
          const gradient = gradients[i % gradients.length];
          const hasImage = !!space.image_url;

          return (
            <div
              key={i}
              className={`${spanClass} relative overflow-hidden rounded-xl ${
                hasImage
                  ? "shadow-md"
                  : `bg-gradient-to-br ${gradient} border border-border`
              }`}
            >
              {hasImage ? (
                <>
                  <img
                    src={space.image_url}
                    alt={space.label}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                  <div className="relative flex flex-col justify-end h-full p-4">
                    <h3 className="font-bold text-white text-sm mb-0.5 drop-shadow-sm">
                      {space.label || "Sem nome"}
                    </h3>
                    {space.description && (
                      <p className="text-xs text-white/70 line-clamp-2">{space.description}</p>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-4 h-full">
                  <div className="w-10 h-10 rounded-xl bg-card/80 border border-border flex items-center justify-center mb-2 shadow-sm">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground text-sm mb-0.5">
                    {space.label || "Sem nome"}
                  </h3>
                  {space.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{space.description}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GalleryPreview;
