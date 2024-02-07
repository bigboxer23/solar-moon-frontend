import 'react-data-grid/lib/styles.css';

import { useEffect, useRef, useState } from 'react';
import DataGrid from 'react-data-grid';
import { useIntl } from 'react-intl';
import { useSearchParams } from 'react-router-dom';

import { ALL, DAY } from '../../../services/search';
import { getDataPage } from '../../../services/services';
import {
  getFormattedTime,
  getRoundedTime,
  getWeatherIcon,
  useSearchParamState,
} from '../../../utils/Utils';
import Loader from '../../common/Loader';
import DownloadReportButton from './DownloadReportButton';
import SearchBar from './SearchBar';

const Reports = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [subLoad, setSubLoad] = useState(false);
  const [site, setSite] = useSearchParamState(
    ALL,
    'site',
    searchParams,
    setSearchParams,
  );
  const [device, setDevice] = useSearchParamState(
    ALL,
    'device',
    searchParams,
    setSearchParams,
  );

  const [start, setStart] = useSearchParamState(
    getRoundedTime(false, DAY).getTime(),
    'start',
    searchParams,
    setSearchParams,
  );
  const [end, setEnd] = useSearchParamState(
    getRoundedTime(true, 0).getTime(),
    'end',
    searchParams,
    setSearchParams,
  );
  const [devices, setDevices] = useState([]);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(-1);
  const [refreshSearch, setRefreshSearch] = useState(false);
  const gridRef = useRef(null);

  const intl = useIntl();
  useEffect(() => {
    fetchData(0, (rows) => setRows(rows), true);
  }, []);

  const WeatherRowRenderer = (row) => {
    const temperature =
      row.row['temperature'] === undefined
        ? ''
        : Math.round(row.row['temperature']) + '°F';
    return (
      <div
        className='flex h-full items-center justify-center'
        title={row.row['weatherSummary'] + ' ' + temperature}
      >
        {getWeatherIcon(row.row['weatherSummary'])}
      </div>
    );
  };

  const columns = [
    {
      key: 'weatherSummary',
      name: (
        <div
          className='flex h-full items-center justify-center'
          title='Weather Conditions'
        >
          {getWeatherIcon('Partly Cloudy')}
        </div>
      ),
      width: 50,
      renderCell: WeatherRowRenderer,
    },
    { key: 'time', name: 'Time', width: 150 },
    { key: 'site', name: 'Site' },
    { key: 'device-name', name: 'Device Name' },
    {
      key: 'Total Energy Consumption',
      name: (
        <div className='flex'>
          Total Energy Cons.
          <div className='rdg-header-secondary text-gray-400'>&nbsp; kWH</div>
        </div>
      ),
    },
    {
      key: 'Total Real Power',
      name: (
        <div className='flex'>
          Total Power
          <div className='rdg-header-secondary text-gray-400'>&nbsp; kW</div>
        </div>
      ),
    },
    {
      key: 'Energy Consumed',
      name: (
        <div className='flex'>
          Energy Cons.{' '}
          <div className='rdg-header-secondary text-gray-400'>&nbsp; kWH</div>
        </div>
      ),
    },
  ];

  const getRow = function (row) {
    row.time = getFormattedTime(new Date(row['@timestamp']));
    if (row['Total Energy Consumption'] != null) {
      row['Total Energy Consumption'] = intl.formatNumber(
        row['Total Energy Consumption'],
      );
    }
    return row;
  };

  useEffect(() => {
    if (loading) {
      return;
    }
    fetchData(0, (rows) => setRows(rows), true);
  }, [site, device, start, end]);

  useEffect(() => {
    if (loading || !refreshSearch) {
      return;
    }
    fetchData(0, (rows) => setRows(rows), true);
  }, [refreshSearch]);

  const fetchData = (offset, rowSetter, shouldScrollToTop) => {
    setLoading(true);
    setSubLoad(offset > 0);
    setTotal(shouldScrollToTop ? -1 : total);
    getDataPage(
      site === ALL ? null : site,
      device === ALL ? null : device,
      start,
      end,
      offset,
      500,
    )
      .then(({ data }) => {
        setLoading(false);
        setSubLoad(false);
        setRefreshSearch(false);
        setTotal(data.hits.total.value);
        rowSetter(data.hits.hits.map((row) => getRow(row._source)));
        if (shouldScrollToTop) {
          scrollToTop();
        }
      })
      .catch((e) => {
        setLoading(false);
        setRefreshSearch(false);
      });
  };

  const EmptyRowsRenderer = () => {
    return (
      <div
        className='fw-bolder h6 p-3'
        style={{ textAlign: 'center', gridColumn: '1/-1' }}
      >
        No data available, modify your search or set-up some devices!
      </div>
    );
  };

  const scrollToTop = () => {
    gridRef.current.scrollToCell({ rowIdx: 0, idx: 0 });
  };

  async function handleScroll(event) {
    if (loading || !isAtBottom(event) || rows.length === total) return;
    fetchData(rows.length, (r) => setRows([...rows, ...r]), false);
  }

  const isAtBottom = ({ currentTarget }) => {
    return (
      currentTarget.scrollTop + 10 >=
      currentTarget.scrollHeight - currentTarget.clientHeight
    );
  };

  return (
    <main className='Reports flex w-full flex-col items-center px-2 sm:px-5'>
      <div className='fade-in  my-8 flex w-[75rem] max-w-full flex-col rounded-lg bg-white shadow-panel dark:bg-gray-800 '>
        <div className='flex w-full items-center justify-between p-2 pb-4 pt-8 sm:p-8'>
          <span className='hidden text-lg font-bold text-black sm:block dark:text-gray-100'>
            Reports
          </span>
          <SearchBar
            defaultSearchPeriod={DAY}
            device={device}
            devices={devices}
            end={end}
            refreshSearch={refreshSearch}
            setDevice={setDevice}
            setDevices={setDevices}
            setEnd={setEnd}
            setRefreshSearch={setRefreshSearch}
            setSite={setSite}
            setStart={setStart}
            site={site}
            start={start}
          />
          <DownloadReportButton
            device={device}
            end={end}
            site={site}
            start={start}
            timeFormatter={getFormattedTime}
          />
        </div>
        <div className='flex w-full flex-col justify-center p-2 sm:pb-6 sm:pe-6 sm:ps-6'>
          <div className='w-full' id='data-grid'>
            {(!loading || subLoad) && (
              <DataGrid
                className='rdg-light min-h-[70vh] grow'
                columns={columns}
                onScroll={handleScroll}
                ref={gridRef}
                renderers={{ noRowsFallback: <EmptyRowsRenderer /> }}
                rows={rows}
              />
            )}
          </div>
          {loading && <Loader className='self-center' />}
        </div>
      </div>
    </main>
  );
};

export default Reports;
