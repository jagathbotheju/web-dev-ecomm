import prisma from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { notFound } from "next/navigation";

export async function GET(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      filePath: true,
      name: true,
    },
  });

  if (product === null) return notFound();

  const { size } = await fs.stat(product.filePath);
  const file = await fs.readFile(product.filePath);
  const extension = product.filePath.split(".").pop();

  return new NextResponse(file, {
    headers: {
      "Content-Disposition": `attachment; filename="${product.name}.${extension}`,
      "Content-Length": size.toString(),
    },
  });
}
