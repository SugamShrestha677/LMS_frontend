import React from 'react';

type TableProps = {
  children: React.ReactNode;
};

type TableRowProps = {
  children: React.ReactNode;
};

type TableCellProps = {
  children: React.ReactNode;
};

export const Table: React.FC<TableProps> = ({ children }) => {
  return (
    <table className="w-full border-collapse border border-gray-300">
      {children}
    </table>
  );
};

export const TableRow: React.FC<TableRowProps> = ({ children }) => {
  return <tr className="border-b border-gray-200">{children}</tr>;
};

export const TableCell: React.FC<TableCellProps> = ({ children }) => {
  return <td className="p-4 text-left text-gray-700">{children}</td>;
};

export type AttendanceRecord = {
  id: number;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
};

// Ensure proper type declarations for module resolution
export default Table;