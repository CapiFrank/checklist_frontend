import type { FC } from "react";

interface InputErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  message: string;
  className?: string;
}

const InputError: FC<InputErrorProps> = ({
  message,
  className = "",
  ...props
}) => {
  if (!message) return null;

  return (
    <p {...props} className={`text-sm text-red-600 break-words whitespace-pre-wrap ${className}`}>
      {message}
    </p>
  );
};

export default InputError;
