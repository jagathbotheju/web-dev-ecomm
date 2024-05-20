"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { ProductFormSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ChangeEvent, useTransition } from "react";
import { createProduct, updateProduct } from "@/actions/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Product } from "@prisma/client";
import Image from "next/image";
import _ from "lodash";

const ProductForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof ProductFormSchema>>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      file: new File([], ""),
      image: [new File([], "")],
      // image: '',
    },
    mode: "all",
  });

  const onSubmit = (values: z.infer<typeof ProductFormSchema>) => {
    startTransition(async () => {
      const imageArrayBuffer = await values.image[0].arrayBuffer();
      const imageBuffer = new Uint8Array(imageArrayBuffer);

      const fileArrayBuffer = await values.file.arrayBuffer();
      const fileBuffer = new Uint8Array(fileArrayBuffer);

      createProduct({
        name: values.name,
        price: values.price,
        description: values.description,
        fileBuffer,
        fileName: values.file.name,
        imageName: values.image[0].name,
        imageBuffer,
      })
        .then((res) => {
          if (res.success) {
            router.push("/admin/products");
            return toast.success(res.message);
          } else {
            return toast.error(res.error);
          }
        })
        .catch((err) => {
          console.log(err);
          return toast.error("Server Error");
        });
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        // action={testProduct}
        className="space-y-8 w-[50%]"
        noValidate
      >
        {/* name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* price */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* file */}
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  {...field}
                  accept="application/pdf"
                  value={undefined}
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      const file = files[0];
                      field.onChange(file);
                    }
                  }}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* image */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  {...field}
                  value={undefined}
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      field.onChange(Array.from(files));
                    }
                  }}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Create New</Button>
      </form>
    </Form>
  );
};

export default ProductForm;
