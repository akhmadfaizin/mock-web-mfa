"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TransactionTable from "../components/TransactionTable";

export default function DashboardPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/transaction-history")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div className="w-full">
      <div className="w-full py-10 flex flex-col items-center gap-4 text-black">
        <div>Transaction History Table</div>
        <div>
          <TransactionTable data={data} />
        </div>
      </div>
    </div>
  );
}
