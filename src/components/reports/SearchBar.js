import 'react-day-picker/dist/style.css';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';

import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import { useState } from 'react';
import { Button, Dropdown, Spinner } from 'react-bootstrap';
import {
  MdClear,
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
  MdRefresh,
  MdSearch,
} from 'react-icons/md';
import { TbFilterCancel } from 'react-icons/tb';

import { getDevices } from '../../services/services';
import { getRoundedTime, sortDevices } from '../../utils/Utils';

const SearchBar = ({
  devices,
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
  const [value, setValue] = useState([
    new Date(Number(start)),
    new Date(Number(end)),
  ]);

  const resetSearch = () => {
    setSite('All Sites');
    setDevice('All Devices');
    dateChanged(null);
    document.getElementById('reports-search').classList.add('d-none');
    document.getElementById('reports-search-button').classList.remove('d-none');
  };

  const loadSearches = () => {
    document.getElementById('reports-search').classList.remove('d-none');
    document.getElementById('reports-search-button').classList.add('d-none');
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

  return (
    <div className='grow-1 d-flex'>
      <div className='d-flex d-none flex-wrap' id='reports-search'>
        <DateRangePicker
          calendarIcon={null}
          calendarType='gregory'
          clearIcon={<MdClear />}
          next2Label={<MdOutlineKeyboardDoubleArrowRight className='h3 mb-0' />}
          nextLabel={<MdOutlineKeyboardArrowRight className='h3 mb-0' />}
          onChange={dateChanged}
          prev2Label={<MdOutlineKeyboardDoubleArrowLeft className='h3 mb-0' />}
          prevLabel={<MdOutlineKeyboardArrowLeft className='h3 mb-0' />}
          value={value}
        />
        <Dropdown className='align-self-end ms-2'>
          <Dropdown.Toggle id='dropdown-basic' variant='secondary'>
            {site}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {[
              { id: 'All Sites', name: 'All Sites', virtual: true },
              ...devices.filter((device) => device.virtual).sort(sortDevices),
            ].map((d) => {
              return (
                <Dropdown.Item
                  as='button'
                  key={d.id}
                  onClick={() => {
                    setSite(d.name);
                    setDevice('All Devices');
                  }}
                >
                  {d.name}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown className='align-self-end ms-2'>
          <Dropdown.Toggle id='dropdown-basic' variant='secondary'>
            {device}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {[
              { id: 'All Devices', name: 'All Devices' },
              ...devices
                .filter((d) => {
                  return (
                    site === 'All Sites' ||
                    d.site === site ||
                    d.name === 'All Devices'
                  );
                })
                .sort(sortDevices),
            ].map((d) => {
              return (
                <Dropdown.Item
                  as='button'
                  key={d.id + 'device'}
                  onClick={() => setDevice(d.name)}
                >
                  {d.name == null ? d.deviceName : d.name}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
        <Button
          className={(refreshSearch ? 'disabled ' : '') + 'ms-2'}
          id='report-download-button'
          onClick={() => setRefreshSearch(true)}
          title='Refresh Data'
          variant='secondary'
        >
          <Spinner
            animation='border'
            as='span'
            className='d-none'
            role='status'
            size='sm'
          />
          <MdRefresh style={{ marginBottom: '2px' }} />
        </Button>
        <Button
          className='ms-2'
          onClick={() => resetSearch()}
          title='Reset Search'
          variant='secondary'
        >
          <TbFilterCancel style={{ marginBottom: '2px' }} />
          <span className='btn-txt'>Reset Search</span>
        </Button>
      </div>
      <div className='grow-1' />
      <Button
        className='ms-3'
        id='reports-search-button'
        onClick={(e) => loadSearches()}
        title='Search'
        variant='primary'
      >
        <MdSearch className='button-icon' />
        Search
      </Button>
    </div>
  );
};
export default SearchBar;
