"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { EditFormSchema } from "@/lib/schema";
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

interface Props {
  product: Product;
}

const EditForm = ({ product }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof EditFormSchema>>({
    resolver: zodResolver(EditFormSchema),
    defaultValues: {
      name: product ? product.name : "",
      price: product ? product.price : 0,
      description: product ? product.description : "",
      file: new File([], ""),
      image: [new File([], "")],
      // image: '',
    },
    mode: "all",
  });

  const onSubmit = (values: z.infer<typeof EditFormSchema>) => {
    startTransition(async () => {
      let imageBuffer = new Uint8Array();
      if (values.image) {
        const imageArrayBuffer = await values?.image[0].arrayBuffer();
        imageBuffer = new Uint8Array(imageArrayBuffer);
      }

      let fileBuffer = new Uint8Array();
      if (values.file) {
        const fileArrayBuffer = await values?.file.arrayBuffer();
        fileBuffer = new Uint8Array(fileArrayBuffer);
      }

      updateProduct({
        id: product.id,
        name: values.name,
        price: values.price,
        description: values.description,
        fileBuffer,
        fileName: values.file ? values.file.name : "",
        filePath: product.filePath,
        imageName: values.image ? values.image[0].name : "",
        imageBuffer,
        imagePath: product.image,
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
              {product && <FormDescription>{product.filePath}</FormDescription>}
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
              {product && (
                <Image
                  src={`/${product.image}`}
                  height={300}
                  width={300}
                  alt="product"
                />
              )}
            </FormItem>
          )}
        />

        <Button type="submit">Create New</Button>
      </form>
    </Form>
  );
};

export default EditForm;
