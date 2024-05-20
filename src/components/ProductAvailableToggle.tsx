"use client";
import { useTransition } from "react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { toggleProductAvailability } from "@/actions/actions";
import { toast } from "sonner";

const ProductAvailableToggle = ({
  id,
  isAvailable,
}: {
  id: string;
  isAvailable: boolean;
}) => {
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        startTransition(() => {
          toggleProductAvailability({ id, isAvailable })
            .then((res) => {
              if (res.success) {
                return toast.success(res.message);
              } else {
                return toast.error(res.error);
              }
            })
            .catch((err) => {
              return toast.error(err);
            });
        });
      }}
    >
      {isAvailable ? "DeActivate" : "Activate"}
    </DropdownMenuItem>
  );
};

export default ProductAvailableToggle;
