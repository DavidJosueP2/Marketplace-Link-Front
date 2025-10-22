import { Button } from "@/components/ui/shadcn/button";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { IncidenceDetailResponse } from "../types/d.types";
import { toast } from "sonner";

export const rowActions = (row: { original: IncidenceDetailResponse }) => {
  const publicUi = row.original.incidence_id;
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/marketplace-refactored/incidencias/${publicUi}`);
  };

  return (
    <div className="flex items-center gap-2 justify-end">
      <Button variant="outline" size="sm" onClick={handleView}>
        <Eye className="w-4 h-4" />
      </Button>
    </div>
  );
};
