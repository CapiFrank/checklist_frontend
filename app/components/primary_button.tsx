import type { FC } from "react";

interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: string;
  danger?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

const PrimaryButton: FC<PrimaryButtonProps> = ({
  color,
  danger,
  disabled,
  children,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`${className} inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer ${disabled && "opacity-25"} ${color ? color : danger ? "bg-red-600 hover:bg-red-500 active:bg-red-700 focus:bg-red-500 focus:ring-red-500" : "bg-slate-800 hover:bg-slate-700 active:bg-slate-900 focus:bg-slate-700 focus:ring-slate-700"}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
export default PrimaryButton;
