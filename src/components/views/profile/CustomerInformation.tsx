import React, { useState } from 'react';
import { allTimezones, useTimezoneSelect } from 'react-timezone-select';

import { updateCustomer } from '../../../services/services';
import type { Customer } from '../../../types/models';
import { Input } from '../../common/Input';
import { Select } from '../../common/Select';

interface CustomerInformationProps {
  customer: Customer;
}

interface TimezoneOption {
  value: string;
  label: string;
}

export default function CustomerInformation({
  customer,
}: CustomerInformationProps): React.ReactElement {
  const [selectedTimezone, setSelectedTimezone] = useState<string>(
    customer?.defaultTimezone ||
      Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const labelStyle = 'original';
  const timezones = allTimezones;
  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });

  const updateTimeZone = (timezone: TimezoneOption): void => {
    setSelectedTimezone(timezone.value);
    updateCustomer({ ...customer, defaultTimezone: timezone.value });
  };

  return (
    <div className='fade-in my-8 w-[40rem] max-w-full bg-white p-6 shadow-panel dark:bg-gray-800 sm:rounded-lg sm:p-8'>
      <div className='mb-8 flex w-full justify-between'>
        <span className='text-lg font-bold text-black dark:text-gray-100'>
          Customer Information
        </span>
      </div>
      <form>
        <Input
          className='mb-6'
          inputProps={{
            readOnly: true,
            value: customer?.email || '',
            type: 'text',
          }}
          label='Email Address'
          variant='underline'
        />

        <Input
          className='mb-4'
          inputProps={{
            readOnly: true,
            value: customer?.name || '',
            type: 'text',
          }}
          label='Name'
          variant='underline'
        />
        <Select
          attributes={options.map((tz: TimezoneOption) => {
            return { label: tz.label, id: tz.value };
          })}
          inputProps={{
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
              updateTimeZone(parseTimezone(e.currentTarget.value)),
            value: selectedTimezone,
          }}
          label='Default Timezone'
          variant='underline'
        />
      </form>
    </div>
  );
}
