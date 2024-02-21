import 'react-data-grid/lib/styles.css';

import { useEffect, useRef, useState } from 'react';
import DataGrid from 'react-data-grid';
import { useIntl } from 'react-intl';
import { useSearchParams } from 'react-router-dom';

import { ALL, DAY } from '../../../services/search';
import { getDataPage, getDevices } from '../../../services/services';
import {
  getDeviceIdToNameMap,
  getFormattedTime,
  getRoundedTime,
  getWeatherIcon,
  useSearchParamState,
} from '../../../utils/Utils';
import Loader from '../../common/Loader';
import DownloadReportButton from './DownloadReportButton';
import { transformRowData } from './ReportUtils';
import SearchBar from './SearchBar';

const Reports = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [init, setInit] = useState(false);
  const [subLoad, setSubLoad] = useState(false);
  const [siteId, setSiteId] = useSearchParamState(
    ALL,
    'siteId',
    searchParams,
    setSearchParams,
  );
  const [deviceId, setDeviceId] = useSearchParamState(
    ALL,
    'deviceId',
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
  const [deviceMap, setDeviceMap] = useState({});
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(-1);
  const [refreshSearch, setRefreshSearch] = useState(false);
  const gridRef = useRef(null);

  const intl = useIntl();
  useEffect(() => {
    getDevices().then(({ data }) => {
      setDevices(data);
      setDeviceMap(getDeviceIdToNameMap(data));
      setInit(true);
    });
  }, []);

  useEffect(() => {
    if (!init) {
      return;
    }
    fetchData(0, (rows) => setRows(rows), true);
  }, [devices]);

  const WeatherRowRenderer = (row) => {
    const temperature =
      row.row['temperature'] === undefined
        ? ''
        : Math.round(row.row['temperature']) + '°F';
    return (
      <div
        className='flex h-full items-center justify-center'
        title={row.row['weatherSummary.keyword'] + ' ' + temperature}
      >
        {getWeatherIcon(
          row.row['weatherSummary.keyword'] &&
            row.row['weatherSummary.keyword'][0],
        )}
      </div>
    );
  };

  const columns = [
    {
      key: 'weatherSummary.keyword',
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
    { key: 'siteId.keyword', name: 'Site' },
    { key: 'device-id.keyword', name: 'Device Name' },
    {
      key: 'Total Energy Consumption',
      name: (
        <div className='flex'>
          Total Consumption
          <div className='rdg-header-secondary text-gray-400'>&nbsp; kWH</div>
        </div>
      ),
    },
    {
      key: 'Total Real Power',
      name: (
        <div className='flex'>
          Power
          <div className='rdg-header-secondary text-gray-400'>&nbsp; kW</div>
        </div>
      ),
    },
    {
      key: 'Energy Consumed',
      name: (
        <div className='flex'>
          Consumption
          <div className='rdg-header-secondary text-gray-400'>&nbsp; kWH</div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (loading) {
      return;
    }
    fetchData(0, (rows) => setRows(rows), true);
  }, [siteId, deviceId, start, end]);

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
      deviceId === ALL ? null : deviceId,
      siteId === ALL ? null : siteId,
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
        rowSetter(
          data.hits.hits.map((row) =>
            transformRowData(row.fields, deviceMap, intl),
          ),
        );
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
    <main className='Reports flex w-full flex-col items-center sm:px-5'>
      <div className='fade-in  my-8 flex w-[75rem] max-w-full flex-col bg-white shadow-panel dark:bg-gray-800 sm:rounded-lg '>
        <div className='flex w-full items-center justify-between p-2 pb-4 pt-8 sm:p-8'>
          <span className='hidden text-lg font-bold text-black dark:text-gray-100 sm:block'>
            Reports
          </span>
          <SearchBar
            defaultSearchPeriod={DAY}
            deviceId={deviceId}
            devices={devices}
            end={end}
            refreshSearch={refreshSearch}
            setDeviceId={setDeviceId}
            setEnd={setEnd}
            setRefreshSearch={setRefreshSearch}
            setSiteId={setSiteId}
            setStart={setStart}
            siteId={siteId}
            start={start}
          />
          <DownloadReportButton
            deviceId={deviceId}
            deviceMap={deviceMap}
            end={end}
            siteId={siteId}
            start={start}
            timeFormatter={getFormattedTime}
          />
        </div>
        <div className='flex w-full flex-col justify-center px-1 sm:px-6 sm:pb-6'>
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
