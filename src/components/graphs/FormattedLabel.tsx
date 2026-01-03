import type { ReactElement, ReactNode } from 'react';
import { FormattedNumber } from 'react-intl';

interface FormattedLabelProps {
  value: number;
  label?: ReactNode;
  unit?: ReactNode;
  separator?: ReactNode;
  className?: string;
}

const FormattedLabel = ({
  value,
  label,
  unit,
  separator,
  className,
}: FormattedLabelProps): ReactElement | string => {
  return value === -1 ? (
    'Loading'
  ) : (
    <span className={className}>
      {label} <FormattedNumber value={value} />
      {separator}
      {unit}
    </span>
  );
};

export default FormattedLabel;
