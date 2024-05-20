"use client";
import { useTransition } from "react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { deleteProduct, toggleProductAvailability } from "@/actions/actions";
import { toast } from "sonner";

const DeleteProduct = ({ id, disabled }: { id: string; disabled: boolean }) => {
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenuItem
      className="hover:!bg-red-500 hover:!text-white"
      disabled={isPending || disabled}
      onClick={() => {
        startTransition(() => {
          deleteProduct(id)
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
      <span className="">Delete</span>
    </DropdownMenuItem>
  );
};

export default DeleteProduct;
