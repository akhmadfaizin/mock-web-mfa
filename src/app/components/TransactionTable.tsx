interface ITransactionTable {
  data: ITransactionItem[];
}

interface ITransactionItem {
  date: string;
  referenceId: string;
  to: string;
  transactionType: string;
  amount: string;
}

export default function TransactionTable(props: ITransactionTable) {
  return (
    <table className="w-full border border-gray-300">
      <thead>
        <tr className="bg-gray-200 text-center border-b border-gray-300">
          <th className="p-2 text-sm font-semibold text-gray-800">Date</th>
          <th className="p-2 text-sm font-semibold text-gray-800">
            Reference ID
          </th>
          <th className="p-2 text-sm font-semibold text-gray-800">To</th>
          <th className="p-2 text-sm font-semibold text-gray-800">
            Transaction Type
          </th>
          <th className="p-2 text-sm font-semibold text-gray-800">Amount</th>
        </tr>
      </thead>
      <tbody>
        {props.data.map((item: ITransactionItem) => (
          <tr
            key={item.referenceId}
            className="hover:bg-gray-100 border-b border-gray-300"
          >
            <td className="p-2 text-sm text-gray-700">{item.date}</td>
            <td className="p-2 text-sm text-gray-700">{item.referenceId}</td>
            <td className="p-2 text-sm text-gray-700">
              {item.to}
              <div className="text-xs text-gray-500">
                Recipient references will go here
              </div>
            </td>
            <td className="p-2 text-sm text-gray-700">
              {item.transactionType}
            </td>
            <td className="p-2 text-sm text-gray-700 text-right">
              {item.amount}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
