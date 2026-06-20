export default function Spinner({
  size = "md",
  className = "",
  title = "Loading...",
}) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-10 h-10 border-4",
  };

  const classes = `
    ${sizes[size]}
    border-[#d9def0]
    border-t-[#ff2f74]
    border-r-[#3d3fa5]
    rounded-full
    animate-spin
    shadow-[0_0_0_4px_rgba(61,63,165,0.06)]
    ${className}
  `;

  return <div className={classes} title={title}></div>;
}

//example usage
// <Spinner size="lg" className="text-blue-500" />