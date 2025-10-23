import { Eye } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import { useNavigate } from "react-router-dom";

export const rowActions = (row: any) => {
  const navigate = useNavigate();
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() =>
        navigate(`/marketplace-refactored/apelaciones/${row.original.id}`)
      }
    >
      <Eye className="w-4 h-4 mr-1" /> Ver detalle
    </Button>
  );
};
