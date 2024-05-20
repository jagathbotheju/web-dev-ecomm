"use server";
import { z } from "zod";
import prisma from "@/lib/prismadb";
import { ProductFormSchema } from "@/lib/schema";
import { promises as fs } from "fs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Product } from "@prisma/client";
import _ from "lodash";

export const deleteProduct = async (id: string) => {
  try {
    const deletedProduct = (await prisma.product.delete({
      where: { id },
    })) as Product;

    if (deletedProduct) {
      await fs.unlink(deletedProduct.filePath); //delete the file
      await fs.unlink(`public/${deletedProduct.image}`);
      revalidatePath("/admin/products");
      return {
        success: true,
        message: "Product deleted successfully",
      };
    }

    return {
      success: false,
      error: "Could not toggle product availability, try again later...",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Internal Server Error, deleting product",
    };
  }
};

export const toggleProductAvailability = async ({
  id,
  isAvailable,
}: {
  id: string;
  isAvailable: boolean;
}) => {
  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { isAvailable: !isAvailable },
    });

    if (updatedProduct) {
      revalidatePath("/admin/products");
      return {
        success: true,
        message: "Product availability updated successfully",
      };
    }

    return {
      success: false,
      error: "Could not toggle product availability, try again later...",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Internal Server Error, toggling product availability",
    };
  }
};

export const createProduct = async ({
  name,
  price,
  description,
  fileBuffer,
  fileName,
  imageBuffer,
  imageName,
}: {
  name: string;
  price: number;
  description: string;
  fileBuffer: Uint8Array;
  fileName: string;
  imageBuffer: Uint8Array;
  imageName: string;
}) => {
  try {
    // file
    await fs.mkdir("products", { recursive: true });
    const filePath = `products/${crypto.randomUUID()}-${fileName}`;
    await fs.writeFile(filePath, Buffer.from(fileBuffer));

    // image
    await fs.mkdir("public/products", { recursive: true });
    const imagePath = `products/${crypto.randomUUID()}-${imageName}`;
    await fs.writeFile(`public/${imagePath}`, Buffer.from(imageBuffer));

    const product = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: price,
        image: imagePath,
        filePath,
      },
    });

    console.log("server product", product);

    if (product) {
      revalidatePath("/admin/products");
      return {
        success: true,
        data: product,
        message: "Product Created Successfully",
      };
    }

    return {
      success: false,
      error: "Could not create Product, try again later.",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Internal Server Error, creating new Product",
    };
  }
};

export const updateProduct = async ({
  id,
  name,
  price,
  description,
  fileBuffer,
  fileName,
  filePath,
  imageBuffer,
  imageName,
  imagePath,
}: {
  id: string;
  name: string;
  price: number;
  description: string;
  fileBuffer: Uint8Array;
  fileName: string;
  filePath: string;
  imageBuffer: Uint8Array | null;
  imageName: string;
  imagePath: string;
}) => {
  try {
    // file
    console.log("updating product...");
    let fPath = filePath;
    if (!_.isEmpty(fileBuffer) && fileName) {
      await fs.unlink(fPath);
      fPath = `products/${crypto.randomUUID()}-${fileName}`;
      await fs.writeFile(fPath, Buffer.from(fileBuffer));
    }

    // image
    let iPath: string = imagePath;
    if (!_.isEmpty(imageBuffer) && imageBuffer !== null) {
      await fs.unlink(`public/${iPath}`);
      iPath = `products/${crypto.randomUUID()}-${imageName}`;
      await fs.writeFile(`public/${iPath}`, Buffer.from(imageBuffer));
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: name,
        description: description,
        price: price,
        image: iPath,
        filePath: fPath,
      },
    });

    if (product) {
      revalidatePath("/admin/products");
      return {
        success: true,
        data: product,
        message: "Product updated Successfully",
      };
    }

    return {
      success: false,
      error: "Could not update Product, try again later.",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Internal Server Error, update new Product",
    };
  }
};

export const getProducts = async () => {
  try {
    const [activeCount, inactiveCount] = await Promise.all([
      prisma.product.count({ where: { isAvailable: true } }),
      prisma.product.count({ where: { isAvailable: false } }),
    ]);

    if (activeCount && inactiveCount) {
      return {
        success: true,
        data: { activeCount, inactiveCount },
      };
    }

    return {
      success: false,
      error: "could not get products, please try later",
    };
  } catch (error) {
    return {
      success: false,
      error: "Internal Server Error, getting products",
    };
  }
};

export const getUsers = async () => {
  try {
    const [userCount, orderData] = await Promise.all([
      prisma.user.count(),
      prisma.order.aggregate({
        _sum: { price: true },
      }),
    ]);

    if (userCount && orderData) {
      const fData = {
        userCount,
        averageValuePerUser:
          userCount === 0 ? 0 : (orderData._sum.price || 0) / userCount / 100,
      };
      return {
        success: true,
        data: fData,
      };
    }

    return {
      success: false,
      error: "cold not get user data",
    };
  } catch (error) {
    return {
      success: false,
      error: "Internal Server Error",
    };
  }
};

export const getSales = async () => {
  try {
    const salesData = await prisma.order.aggregate({
      _sum: { price: true },
      _count: true,
    });

    if (salesData) {
      const fData = {
        amount: (salesData._sum.price || 0) / 100,
        numberOfSales: salesData._count,
      };
      return {
        success: true,
        data: fData,
      };
    }

    return {
      success: false,
      error: "Could not get Sales",
    };
  } catch (error) {
    return {
      success: false,
      error: "Internal Server Error",
    };
  }
};
