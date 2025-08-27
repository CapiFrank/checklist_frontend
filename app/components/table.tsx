import React, { useState, type FC } from "react";
import PrimaryButton from "./primary_button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface TableProps<T extends Record<string, any>> {
  data: T[];
  columns: Array<{ key: string; label: string }>;
  rowsPerPage?: number;
  actions?: Array<{
    label: string | ((row: T) => string);
    icon?: any | ((row: T) => any);
    onClick: (row: T) => void;
    disabled?: (row: T) => boolean;
  }>;
  onColClick?: (row: T) => void;
  extraColumns?:
    | Array<{
        label: string;
        render: (row: T) => React.ReactNode;
      }>
    | [];
}

const Table = <T extends Record<string, any>>({
  data,
  columns,
  rowsPerPage = 10,
  actions = [],
  onColClick,
  extraColumns = [],
}: TableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return data.slice(startIndex, startIndex + rowsPerPage);
  };

  const handlePageChange = (direction: string) => {
    setCurrentPage((prevPage) => {
      const newPage = direction === "next" ? prevPage + 1 : prevPage - 1;
      return Math.max(1, Math.min(newPage, totalPages));
    });
  };

  return (
    <div className="overflow-x-auto ">
      <table className="min-w-full select-none">
        <thead className="border-y-2 border-gray-300 bg-slate-800 text-white">
          <tr>
            {columns.map(({ key, label }) => (
              <th key={String(key)} className="text-left py-2 px-4">
                {label}
              </th>
            ))}
            {actions.length > 0 && (
              <th className="text-left py-2 px-4">Acciones</th>
            )}
            {extraColumns.length > 0 &&
              extraColumns.map(({ label }, i) => (
                <th key={`extra-header-${i}`} className="text-left py-2 px-4">
                  {label}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {getPaginatedData().map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b hover:bg-gray-100 even:bg-slate-200 border-gray-300"
            >
              {columns.map(({ key }) => (
                <td
                  key={String(key)}
                  className="py-2 px-4"
                  onClick={() => onColClick?.(row)}
                >
                  {row[key]}
                </td>
              ))}

              {actions.length > 0 && (
                <td className="py-2 px-4">
                  <div className="inline-flex items-center divide-x">
                    {actions.map((action, actionIndex) => (
                      <span
                        key={actionIndex}
                        onClick={() => action.onClick(row)}
                        className={`px-2 ${
                          action.disabled &&
                          (action.disabled(row)
                            ? "pointer-events-none text-gray-400/80"
                            : "")
                        } cursor-pointer text-blue-400 hover:text-blue-600 active:text-blue-500 hover:underline gap-2 flex items-center`}
                      >
                        {action.icon && (
                          <FontAwesomeIcon
                            icon={
                              typeof action.icon === "function"
                                ? action.icon(row)
                                : action.icon
                            }
                          />
                        )}
                        {typeof action.label === "function"
                          ? action.label(row)
                          : action.label}
                      </span>
                    ))}
                  </div>
                </td>
              )}
              {extraColumns.length > 0 &&
                extraColumns.map(({ render }, i) => (
                  <td key={`extra-col-${i}`} className="py-2 px-4">
                    {render(row)}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center py-2">
        <PrimaryButton
          onClick={() => handlePageChange("prev")}
          disabled={currentPage === 1}
        >
          Anterior
        </PrimaryButton>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <PrimaryButton
          onClick={() => handlePageChange("next")}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </PrimaryButton>
      </div>
    </div>
  );
};

export default Table;
