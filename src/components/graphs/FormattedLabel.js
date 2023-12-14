import { FormattedNumber } from "react-intl";

const FormattedLabel = ({ value, label, unit }) => {
  return value === -1 ? (
    "Loading"
  ) : (
    <div>
      {label} <FormattedNumber value={value} /> {unit}
    </div>
  );
};
export default FormattedLabel;
