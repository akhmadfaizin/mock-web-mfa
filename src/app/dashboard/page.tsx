"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TransactionTable from "../components/TransactionTable";

export default function DashboardPage() {
  const [data, setData] = useState([]);
  const router = useRouter();
  const [user, setUser] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("demo_token");
    const u = localStorage.getItem("demo_user") || "";
    if (!token || !u) {
      router.replace("/login");
      return;
    }
    setUser(u);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("demo_token");
    localStorage.removeItem("demo_user");

    router.replace("/login");
  };

  useEffect(() => {
    fetch("/api/transaction-history")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div className="w-full">
      <div className="max-w-2xl mx-auto p-6 text-black">
        <h1 className="text-2xl font-semibold mb-2">Login successful</h1>
        <p className="text-gray-700">
          Welcome, <span className="font-medium">{user}</span>
        </p>

        <div className="mt-6">
          <button
            className="rounded bg-gray-900 px-4 py-2 text-white cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="w-full py-10 flex flex-col items-center gap-4 text-black">
        <div>Transaction History Table</div>
        <div>
          <TransactionTable data={data} />
        </div>
      </div>
    </div>
  );
}
