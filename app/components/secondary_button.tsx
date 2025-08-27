import type { FC } from "react";

interface SecondaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

const SecondaryButton: FC<SecondaryButtonProps> = ({
  color = "border-slate-800 hover:bg-slate-300 active:bg-slate-400 focus:bg-slate-300 focus:ring-slate-700",
  disabled,
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-md border px-4 py-2 text-xs font-semibold uppercase tracking-widest text-black transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer ${disabled && "opacity-25"} ${color}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
