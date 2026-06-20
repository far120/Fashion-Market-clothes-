import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";

const ICONS = {
  moon: FaIcons.FaMoon,
  sun: FaIcons.FaSun,
  email: MdIcons.MdEmail,
};

export default function Icon({ name, size = 24, className = "" }) {
  const Component = ICONS[name];
  if (!Component) return null;
  return <Component size={size} className={className} />;
}


// Usage examples:
{/* <Icon name="moon" size={20} className="text-gray-500" />
<Icon name="sun" size={24} className="text-yellow-400" />
<Icon name="email" size={30} className="text-blue-500" /> */}