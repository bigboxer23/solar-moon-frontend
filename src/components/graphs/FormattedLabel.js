import { FormattedNumber } from "react-intl";

const FormattedLabel = ({ value, label }) => {
  return value === -1 ? (
    "Loading"
  ) : (
    <div>
      {label} <FormattedNumber value={value} /> kWH
    </div>
  );
};
export default FormattedLabel;
