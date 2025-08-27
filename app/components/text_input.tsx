import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState, type FC } from "react";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  type?: string;
}

const TextInput: FC<TextInputProps> = ({
  className = "",
  type = "text",
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const inputType = type === "password" && isPasswordVisible ? "text" : type;

  return (
    <div className="relative">
      <input
        {...props}
        type={inputType}
        className={`p-2 rounded-md border border-slate-300 shadow-sm focus:border-slate-700 focus:ring-slate-700 w-full ${className}`}
      />
      {type === "password" && (
        <span className="absolute top-1/2 right-2 -translate-y-1/2 w-5 h-5">
          <FontAwesomeIcon
            icon={isPasswordVisible ? faEyeSlash : faEye}
            className="text-gray-500 cursor-pointer w-full h-full"
            onClick={togglePasswordVisibility}
          />
        </span>
      )}
    </div>
  );
};

export default TextInput;
