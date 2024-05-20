import EditForm from "@/components/EditForm";
import ProductForm from "@/components/ProductForm";
import ProductsTable from "@/components/ProductsTable";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prismadb";
import { Product } from "@prisma/client";
import Link from "next/link";

interface Props {
  params: {
    id: string;
  };
}

const EditPage = async ({ params }: Props) => {
  const product = (await prisma.product.findUnique({
    where: {
      id: params.id,
    },
  })) as Product;

  // console.log("EditPage", product);

  return (
    <div className="flex flex-col">
      <div className="justify-between items-center flex gap-4 my-10">
        <h1 className="text-3xl font-bold mb-3">Edit</h1>
        <Button asChild>
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>
      <EditForm product={product} />
    </div>
  );
};

export default EditPage;
