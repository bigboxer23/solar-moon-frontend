import 'react-day-picker/dist/style.css';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';

import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import classNames from 'classnames';
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
import { getRoundedTime, sortDevices } from '../../../utils/Utils';
import Button from '../../common/Button';
import Dropdown from '../../common/Dropdown';
import Spinner from '../../common/Spinner';

const SearchBar = ({
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
}) => {
  const [searchActive, setSearchActive] = useState(false);

  const [value, setValue] = useState([
    new Date(Number(start)),
    new Date(Number(end)),
  ]);

  const resetSearch = () => {
    setSiteId(ALL);
    setDeviceId(ALL);
    dateChanged(null);
    setSearchActive(false);
  };

  const loadSearches = () => {
    setSearchActive(true);
  };

  const dateChanged = (date) => {
    if (date === null) {
      date = [
        getRoundedTime(false, defaultSearchPeriod),
        getRoundedTime(true, 0),
      ];
    }
    setValue(date);
    setStart(date[0].getTime());
    setEnd(date[1].getTime());
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

  const deviceOptions = devices
    .filter((d) => {
      return siteId === ALL || d.siteId === siteId || d.name === ALL;
    })
    .sort(sortDevices)
    .map((d) => {
      return {
        value: d.id,
        label:
          (d.name == null ? d.deviceName : d.name) +
          (d.isSite ? ' (site)' : ''),
      };
    });

  return (
    <div className='flex w-full items-center justify-center'>
      <div
        className={classNames('flex flex-wrap items-center w-full', {
          hidden: !searchActive,
          flex: searchActive,
        })}
      >
        <div className='ml-2 flex flex-wrap items-center space-x-4 sm:ml-6'>
          <DateRangePicker
            calendarClassName='shadow-panel'
            calendarIcon={null}
            calendarType='gregory'
            className='mr-6 sm:mr-0'
            clearIcon={<MdClear aria-label='clear date search' />}
            next2Label={
              <MdOutlineKeyboardDoubleArrowRight className='w-full text-lg' />
            }
            nextLabel={
              <MdOutlineKeyboardArrowRight className='w-full text-lg' />
            }
            onChange={dateChanged}
            prev2Label={
              <MdOutlineKeyboardDoubleArrowLeft className='w-full text-lg' />
            }
            prevLabel={
              <MdOutlineKeyboardArrowLeft className='w-full text-lg' />
            }
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
            options={[allOption, ...deviceOptions]}
            prefixLabel='Device'
            value={deviceOptions.find((option) => option.value === deviceId)}
          />
          <Button
            buttonProps={{
              title: 'Refresh Data',
              'aria-label': 'Refresh Data',
            }}
            disabled={refreshSearch}
            onClick={() => setRefreshSearch(true)}
            title='Refresh Data'
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
          className='ml-auto mr-4'
          onClick={() => loadSearches()}
          title='Search'
          variant='primary'
        >
          <FaSearch className='mr-2' />
          Search
        </Button>
      )}
    </div>
  );
};
export default SearchBar;
