import { type FC } from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const TextArea: FC<TextAreaProps> = ({ className = "", ...props }) => {
  return (
    <div className="relative">
      <textarea
        {...props}
        className={`p-2 rounded-md border border-slate-300 shadow-sm focus:border-slate-700 focus:ring-slate-700 w-full resize-none ${className}`}
      />
    </div>
  );
};

export default TextArea;
