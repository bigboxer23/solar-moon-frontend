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

import { getDevices } from '../../../../services/services';
import { getRoundedTime, sortDevices } from '../../../../utils/Utils';
import Button from '../../common/Button';
import Dropdown from '../../common/Dropdown';
import Spinner from '../../common/Spinner';

const SearchBar = ({
  devices = [],
  setDevices,
  site,
  setSite,
  device,
  setDevice,
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
    setSite('All');
    setDevice('All');
    dateChanged(null);
    setSearchActive(false);
  };

  const loadSearches = () => {
    setSearchActive(true);
    if (devices.length === 0) {
      getDevices().then(({ data }) => {
        setDevices(data);
      });
    }
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

  const allOption = { value: 'all', label: 'All' };

  const siteOptions = devices
    .filter((device) => device.virtual)
    .sort(sortDevices)
    .map((d) => {
      return {
        value: d.id,
        label: d.name == null ? d.deviceName : d.name,
      };
    });

  const deviceOptions = devices
    .filter((device) => !device.virtual)
    .sort(sortDevices)
    .map((d) => {
      return {
        value: d.id,
        label: d.name == null ? d.deviceName : d.name,
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
            calendarIcon={null}
            calendarType='gregory'
            className='mr-6 sm:mr-0'
            clearIcon={<MdClear />}
            next2Label={
              <MdOutlineKeyboardDoubleArrowRight className='h3 mb-0' />
            }
            nextLabel={<MdOutlineKeyboardArrowRight className='h3 mb-0' />}
            onChange={dateChanged}
            prev2Label={
              <MdOutlineKeyboardDoubleArrowLeft className='h3 mb-0' />
            }
            prevLabel={<MdOutlineKeyboardArrowLeft className='h3 mb-0' />}
            value={value}
          />
          <Dropdown
            onChange={(option) => setSite(option.label)}
            options={[allOption, ...siteOptions]}
            prefixLabel='Site'
            value={siteOptions.find((option) => option.label === site)}
          />
          <Dropdown
            onChange={(option) => setDevice(option.label)}
            options={[allOption, ...deviceOptions]}
            prefixLabel='Device'
            value={deviceOptions.find((option) => option.label === device)}
          />
          <Button
            disabled={refreshSearch}
            id='report-download-button'
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
