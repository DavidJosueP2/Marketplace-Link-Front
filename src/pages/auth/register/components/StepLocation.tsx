import { Button } from "@/components/ui/shadcn/button";

interface StepLocationProps {
  locStatus: string;
  locMsg: string;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  askLocation: () => void;
}

export default function StepLocation({
  locStatus,
  locMsg,
  errors,
  touched,
  askLocation
}: StepLocationProps) {
  return (
    <div className="grid gap-4">
      <div className="rounded-lg border p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium flex items-center gap-2">
              Ubicación
              {locStatus === "granted" && (
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-600 text-white">
                  ✓
                </span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">Obligatoria para crear la cuenta.</p>
          </div>
          <Button type="button" variant="outline" onClick={askLocation} disabled={locStatus === "requesting"}>
            {locStatus === "requesting" ? "Obteniendo…" : "Compartir ubicación"}
          </Button>
        </div>
        {locMsg && <p className="text-xs text-red-600 mt-2">{locMsg}</p>}
        {touched.location && errors.location && <p className="text-xs text-red-600 mt-1">{errors.location}</p>}
      </div>

      <div className="text-xs text-muted-foreground">
        Al continuar aceptas que usaremos tu ubicación para mejorar la seguridad y la experiencia en la plataforma.
      </div>
    </div>
  );
}

