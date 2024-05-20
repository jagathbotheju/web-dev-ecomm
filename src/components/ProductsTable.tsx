import prisma from "@/lib/prismadb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import _ from "lodash";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import ProductAvailableToggle from "./ProductAvailableToggle";
import DeleteProduct from "./DeleteProduct";
import { Product } from "@prisma/client";

const ProductsTable = async () => {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      isAvailable: true,
      filePath: true,
      image: true,
      _count: {
        select: { orders: true },
      },
    },
    orderBy: { name: "asc" },
  });

  if (_.isEmpty(products)) {
    return (
      <div className="mt-10">
        <h1 className="p-10 text-2xl font-bold bg-red-100 rounded-md">
          No Products Found
        </h1>
      </div>
    );
  }

  // console.log(products[0]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Available for purchase</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              {product.isAvailable ? (
                <>
                  <CheckCircle2 className="text-green-500" />
                  <span className="sr-only">available</span>
                </>
              ) : (
                <>
                  <XCircle className="text-red-500" />
                  <span className="sr-only">un available</span>
                </>
              )}
            </TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{formatCurrency(product.price)}</TableCell>
            <TableCell>{formatNumber(product._count.orders)}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger className="!focus-visible:ring-0 focus:ring-0">
                  <MoreVertical />
                  <span className="sr-only">actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <a
                      download
                      href={`/admin/products/${product.id}/downloads`}
                    >
                      Download
                    </a>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href={`/admin/products/${product.id}/edit`}>
                      Edit
                    </Link>
                  </DropdownMenuItem>

                  <ProductAvailableToggle
                    id={product.id}
                    isAvailable={product.isAvailable}
                  />
                  <DeleteProduct
                    id={product.id}
                    disabled={product._count.orders > 0}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductsTable;
