import { type FC, useState } from "react";
type ToggleSize = "sm" | "md" | "lg";
interface ToggleProps {
  id?: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: ToggleSize;
  className?: string;
}
const sizeClasses: Record<
  ToggleSize,
  {
    track: string;
    knob: string;
    translate: string;
  }
> = {
  sm: {
    track: "w-[40px] h-[20px]",
    knob: "w-[15px] h-[15.5px] top-[2.5px] left-[2.5px]",
    translate: "translate-x-5",
  },
  md: {
    track: "w-[56px] h-[28px]",
    knob: "w-[23px] h-[23px] top-[3px] left-[2.5px]",
    translate: "translate-x-7",
  },
  lg: {
    track: "w-20 h-10",
    knob: "w-8 h-8 top-1 left-1",
    translate: "translate-x-10",
  },
};
const Toggle: FC<ToggleProps> = ({
  id,
  defaultChecked = false,
  onChange,
  size = "md",
  className = "",
}) => {
  const [checked, setChecked] = useState(defaultChecked);
  const { track, knob, translate } = sizeClasses[size];
  const handleToggle = () => {
    const newValue = !checked;
    setChecked(newValue);
    onChange?.(newValue);
    onChange;
  };
  return (
    <label
      className={`relative inline-flex items-center cursor-pointer ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={handleToggle}
        className="sr-only peer"
        id={id}
      />
      <div
        className={`rounded-full bg-gray-400 peer-checked:bg-blue-400 transition-colors duration-300 ${track}`}
      >
        <span
          className={`absolute bg-white rounded-full transition-all duration-300 ${knob} ${checked ? translate : ""}`}
        />
      </div>
    </label>
  );
};
export default Toggle;

