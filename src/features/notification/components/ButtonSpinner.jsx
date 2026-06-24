const ButtonSpinner = ({ className = "w-4 h-4 text-current" }) => (
  <span
    className={`animate-spin inline-block rounded-full border-2 border-solid border-current border-t-transparent ${className}`}
  />
);

export default ButtonSpinner;