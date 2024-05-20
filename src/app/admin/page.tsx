import { getProducts, getSales, getUsers } from "@/actions/actions";
import AdminDashboardCard from "@/components/AdminDashboardCard";
import { formatCurrency, formatNumber } from "@/lib/formatters";

const AdminDashboardPage = async () => {
  const [salesData, usersData, productData] = await Promise.all([
    getSales(),
    getUsers(),
    getProducts(),
  ]);

  const sales = salesData.data;
  const users = usersData.data;
  const products = productData.data;

  console.log("sales", sales);
  if (!sales || !users || !products)
    return (
      <div className="container mx-auto">
        <h1 className="font-bold text-3xl">No Data Found</h1>
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <AdminDashboardCard
        title="Sales"
        subTitle={`${formatNumber(sales.numberOfSales)} orders`}
        body={formatCurrency(sales.amount)}
      />

      <AdminDashboardCard
        title="Customers"
        subTitle={`${formatCurrency(users.averageValuePerUser)} average value`}
        body={formatNumber(users.userCount)}
      />

      <AdminDashboardCard
        title="Active Products"
        subTitle={`${formatCurrency(products.inactiveCount)} inactive`}
        body={formatNumber(products.activeCount)}
      />
    </div>
  );
};

export default AdminDashboardPage;
