import { useEffect, useState } from "react";
import {
  getParties,
  getPartyById,
  getLedgerHistory,
  addLedgerEntry
} from "../services/api";

function Ledger() {
  const [type, setType] = useState("CUSTOMER");
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState("");
  const [partyDetails, setPartyDetails] = useState(null);
  const [ledgerEntries, setLedgerEntries] = useState([]);

  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("DEBIT");
  const [paymentMethod, setPaymentMethod] = useState("CASH");

  /* ================= FETCH PARTIES ================= */
  useEffect(() => {
    const fetchParties = async () => {
      try {
        const res = await getParties(type);
        setParties(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchParties();
  }, [type]);

  /* ================= FETCH LEDGER ================= */
  useEffect(() => {
    if (!selectedParty) return;

    const fetchLedger = async () => {
      try {
        const partyRes = await getPartyById(selectedParty);
        setPartyDetails(partyRes.data.data);

        const ledgerRes = await getLedgerHistory(selectedParty);
        setLedgerEntries(ledgerRes.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLedger();
  }, [selectedParty]);

  /* ================= ADD ENTRY ================= */
  const handleAddEntry = async () => {
    if (!amount || !selectedParty) return;

    try {
      await addLedgerEntry({
        partyId: selectedParty,
        transactionType,
        amount: Number(amount),
        paymentMethod
      });

      setAmount("");

      const ledgerRes = await getLedgerHistory(selectedParty);
      setLedgerEntries(ledgerRes.data.data || []);

      const partyRes = await getPartyById(selectedParty);
      setPartyDetails(partyRes.data.data);

    } catch (err) {
      console.error(err);
    }
  };

  const balanceColor =
    partyDetails?.currentBalance > 0
      ? "text-red-500"
      : partyDetails?.currentBalance < 0
      ? "text-yellow-500"
      : "text-green-500";

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Ledger
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Track credit, debit and running balances.
        </p>
      </div>

      {/* FILTER CARD */}
      <div className="sv-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setSelectedParty("");
              setPartyDetails(null);
            }}
            className="sv-input"
          >
            <option value="CUSTOMER">Customers</option>
            <option value="SUPPLIER">Suppliers</option>
          </select>

          <select
            value={selectedParty}
            onChange={(e) => setSelectedParty(e.target.value)}
            className="sv-input md:col-span-2"
          >
            <option value="">Select Party</option>
            {parties.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

        </div>
      </div>

      {/* SUMMARY */}
      {partyDetails && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <SummaryCard
            title="Current Balance"
            value={`₹ ${partyDetails.currentBalance}`}
            customColor={balanceColor}
          />
          <SummaryCard
            title="Total Credit"
            value={`₹ ${partyDetails.totalCredit}`}
          />
          <SummaryCard
            title="Total Debit"
            value={`₹ ${partyDetails.totalDebit}`}
          />
        </div>
      )}

      {/* ADD ENTRY */}
      {selectedParty && (
        <div className="sv-card">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="sv-input"
            >
              <option value="DEBIT">Debit</option>
              <option value="CREDIT">Credit</option>
            </select>

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="sv-input"
            />

            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="sv-input"
            >
              <option value="CASH">Cash</option>
              <option value="UPI">UPI</option>
              <option value="BANK">Bank</option>
              <option value="CARD">Card</option>
              <option value="OTHER">Other</option>
            </select>

            <button
              onClick={handleAddEntry}
              className="sv-btn-primary"
            >
              Add Entry
            </button>

          </div>
        </div>
      )}

      {/* TABLE */}
      {ledgerEntries.length > 0 && (
        <div className="sv-card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">

              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr className="text-gray-600 dark:text-gray-300 uppercase text-xs tracking-wider">
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Type</th>
                  <th className="px-6 py-4 text-left">Amount</th>
                  <th className="px-6 py-4 text-left">Method</th>
                  <th className="px-6 py-4 text-left">Running Balance</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {ledgerEntries.map((entry) => (
                  <tr key={entry._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <td className="px-6 py-4">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{entry.transactionType}</td>
                    <td className="px-6 py-4">₹ {entry.amount}</td>
                    <td className="px-6 py-4">{entry.paymentMethod}</td>
                    <td className="px-6 py-4 font-medium">
                      ₹ {entry.runningBalance}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      )}

    </div>
  );
}

function SummaryCard({ title, value, customColor }) {
  return (
    <div className="sv-card">
      <p className="text-xs uppercase text-gray-500 dark:text-gray-400">
        {title}
      </p>
      <p className={`text-xl font-semibold mt-3 ${customColor || ""}`}>
        {value}
      </p>
    </div>
  );
}

export default Ledger;