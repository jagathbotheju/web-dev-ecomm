import ProductsTable from "@/components/ProductsTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ProductsPage = () => {
  return (
    <div className="flex flex-col">
      <div className="justify-between items-center flex gap-4 my-10">
        <h1 className="text-3xl font-bold mb-3">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>
      <ProductsTable />
    </div>
  );
};

export default ProductsPage;
