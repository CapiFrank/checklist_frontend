import type { FC } from "react";

interface InputLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: string;
  className?: string;
}

const InputLabel:FC<InputLabelProps> = ({
  children,
  className = "",
  ...props
}) => {
  if (!children) return null;
  return (
    <label
      {...props}
      className={`text-sm font-medium text-slate-700 ${className}`}
    >
      {children}
    </label>
  );
};

export default InputLabel;
