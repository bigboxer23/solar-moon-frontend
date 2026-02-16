import 'react-calendar/dist/Calendar.css';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-day-picker/style.css';

import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import classNames from 'classnames';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FaRotate } from 'react-icons/fa6';
import {
  MdClear,
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from 'react-icons/md';

import { ALL } from '../../../services/search';
import type { Device } from '../../../types/models';
import {
  getDisplayName,
  getRoundedTime,
  sortDevices,
} from '../../../utils/Utils';
import Button from '../../common/Button';
import { Check } from '../../common/Check';
import Dropdown from '../../common/Dropdown';
import Spinner from '../../common/Spinner';

interface SearchBarProps {
  devices?: Device[];
  siteId: string;
  setSiteId: (value: string) => void;
  deviceId: string;
  setDeviceId: (value: string) => void;
  start: number;
  setStart: (value: number) => void;
  end: number;
  setEnd: (value: number) => void;
  defaultSearchPeriod: number;
  refreshSearch: boolean;
  setRefreshSearch: (value: boolean) => void;
  filterErrors: string;
  setFilterErrors: (value: string) => void;
}

type DateValue = Date | null;
type DateRangeValue = [DateValue, DateValue];

export default function SearchBar({
  devices = [],
  siteId,
  setSiteId,
  deviceId,
  setDeviceId,
  start,
  setStart,
  end,
  setEnd,
  defaultSearchPeriod,
  refreshSearch,
  setRefreshSearch,
  filterErrors,
  setFilterErrors,
}: SearchBarProps): ReactElement {
  const [searchActive, setSearchActive] = useState(
    deviceId !== ALL || siteId !== ALL || filterErrors === 'true',
  );

  const [value, setValue] = useState<DateRangeValue>([
    new Date(Number(start)),
    new Date(Number(end)),
  ]);

  const resetSearch = () => {
    setSiteId(ALL);
    setDeviceId(ALL);
    dateChanged(null);
    setFilterErrors('false');
    setSearchActive(false);
  };

  const loadSearches = () => {
    setSearchActive(true);
  };

  const dateChanged = (date: DateRangeValue | null) => {
    const finalDate: DateRangeValue = date ?? [
      getRoundedTime(false, defaultSearchPeriod),
      getRoundedTime(true, 0),
    ];
    setValue(finalDate);
    if (finalDate[0] && finalDate[1]) {
      setStart(finalDate[0].getTime());
      setEnd(finalDate[1].getTime());
    }
  };

  const allOption = { value: ALL, label: ALL };

  const siteOptions = devices
    .filter((device) => device.isSite)
    .sort(sortDevices)
    .map((d) => {
      return {
        value: d.id,
        label: d.name == null ? d.deviceName : d.name,
      };
    });

  const deviceOptions = [
    ...devices
      .filter((d) => !d.disabled)
      .filter((d) => {
        return siteId === ALL || d.siteId === siteId || d.name === ALL;
      })
      .sort(sortDevices)
      .map((d) => {
        return {
          value: d.id,
          label: getDisplayName(d) + (d.isSite ? ' (site)' : ''),
        };
      }),
    ...devices
      .filter((d) => d.disabled)
      .filter((d) => {
        return siteId === ALL || d.siteId === siteId || d.name === ALL;
      })
      .sort(sortDevices)
      .map((d) => {
        return {
          value: d.id,
          label: (
            <div className='opacity-50' title='(Disabled)'>
              {getDisplayName(d)}
            </div>
          ),
        };
      }),
  ];

  return (
    <div className='flex w-full items-center justify-center'>
      <div
        className={classNames('flex flex-wrap items-center w-full', {
          hidden: !searchActive,
          flex: searchActive,
        })}
      >
        <div className='ml-2 flex flex-wrap items-center gap-x-4 sm:ml-6'>
          <DateRangePicker
            calendarIcon={null}
            calendarProps={{
              calendarType: 'gregory',
              next2Label: (
                <MdOutlineKeyboardDoubleArrowRight className='w-full text-lg' />
              ),
              nextLabel: (
                <MdOutlineKeyboardArrowRight className='w-full text-lg' />
              ),
              prev2Label: (
                <MdOutlineKeyboardDoubleArrowLeft className='w-full text-lg' />
              ),
              prevLabel: (
                <MdOutlineKeyboardArrowLeft className='w-full text-lg' />
              ),
              className: 'shadow-panel',
            }}
            className='mr-6 sm:mr-0'
            clearIcon={<MdClear aria-label='clear date search' />}
            onChange={dateChanged as (value: unknown) => void}
            value={value}
          />
          <Dropdown
            onChange={(option) => {
              setSiteId(option.value);
              setDeviceId(ALL);
            }}
            options={[allOption, ...siteOptions]}
            prefixLabel='Site'
            value={siteOptions.find((option) => option.value === siteId)}
          />
          <Dropdown
            onChange={(option) => setDeviceId(option.value)}
            options={
              [allOption, ...deviceOptions] as Array<{
                value: string;
                label: string;
              }>
            }
            prefixLabel='Device'
            value={
              deviceOptions.find((option) => option.value === deviceId) as {
                value: string;
                label: string;
              }
            }
          />
          <Check
            extendVariantStyles={false}
            id='errors'
            inputProps={{
              value: filterErrors === 'true',
              onChange: () => {},
              name: 'errors',
            }}
            inputWrapperClassName='flex focus-within:border-brand-primary gap-x-1'
            label='Errors:'
            labelClassName='font-bold dark:text-gray-100'
            onClick={() => setFilterErrors(`${!(filterErrors === 'true')}`)}
          />
          <Button
            buttonProps={{
              title: 'Refresh Data',
              'aria-label': 'Refresh Data',
            }}
            disabled={refreshSearch}
            onClick={() => setRefreshSearch(true)}
            variant='icon'
          >
            {refreshSearch && <Spinner />}
            {!refreshSearch && <FaRotate className='text-base' />}
          </Button>
          <Button
            buttonProps={{
              title: 'Reset Search',
              'aria-label': 'Refresh Search',
            }}
            className='ml-auto mr-4'
            onClick={() => resetSearch()}
            variant='text'
          >
            Reset
          </Button>
        </div>
      </div>
      {!searchActive && (
        <Button
          buttonProps={{
            title: 'Search',
            'aria-label': 'Search',
          }}
          className='ml-auto mr-4'
          onClick={() => loadSearches()}
          variant='primary'
        >
          <FaSearch className='mr-2' />
          Search
        </Button>
      )}
    </div>
  );
}
