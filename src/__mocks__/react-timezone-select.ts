interface TimezoneOption {
  label: string;
  value: string;
}

interface ParsedTimezone {
  value: string;
}

export const allTimezones: Record<string, string> = {
  'America/New_York': 'America/New_York',
  'Europe/London': 'Europe/London',
  'Asia/Tokyo': 'Asia/Tokyo',
};

export const useTimezoneSelect = (): {
  options: TimezoneOption[];
  parseTimezone: (value: string) => ParsedTimezone;
} => ({
  options: [
    { label: '(GMT-5:00) Eastern Time - New York', value: 'America/New_York' },
    {
      label: '(GMT+0:00) Greenwich Mean Time - London',
      value: 'Europe/London',
    },
    { label: '(GMT+9:00) Japan Standard Time - Tokyo', value: 'Asia/Tokyo' },
  ],
  parseTimezone: (value: string): ParsedTimezone => ({ value }),
});
