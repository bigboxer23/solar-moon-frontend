import { FormattedNumber } from "react-intl";

const FormattedLabel = ({ value, label, unit, separator, className }) => {
  return value === -1 ? (
    "Loading"
  ) : (
    <span className={className}>
      {label} <FormattedNumber value={value} />
      {separator}
      {unit}
    </span>
  );
};
export default FormattedLabel;
