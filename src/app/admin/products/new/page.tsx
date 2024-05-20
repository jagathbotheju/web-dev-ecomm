import ProductForm from "@/components/ProductForm";

const NewProductPage = () => {
  console.log("NewProductPage...");

  return (
    <div className="flex flex-col container mx-auto">
      <h1 className="text-3xl font-bold mb-10">Add Product</h1>

      <ProductForm />
    </div>
  );
};

export default NewProductPage;
