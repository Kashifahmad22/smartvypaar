import RecordSaleForm from "../components/RecordSaleForm";
import SalesHistoryTable from "../components/SalesHistoryTable";

function Sales() {
  return (
    <div className="space-y-8">
      <RecordSaleForm onSaleRecorded={() => window.location.reload()} />
      <SalesHistoryTable />
    </div>
  );
}

export default Sales;