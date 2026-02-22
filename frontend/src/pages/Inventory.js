import AddProductForm from "../components/AddProductForm";
import ProductInventoryTable from "../components/ProductInventoryTable";

function Inventory() {
  return (
    <div className="space-y-8">
      <AddProductForm onProductAdded={() => window.location.reload()} />
      <ProductInventoryTable />
    </div>
  );
}

export default Inventory;