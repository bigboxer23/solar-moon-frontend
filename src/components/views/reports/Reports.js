import 'react-data-grid/lib/styles.css';

import Tippy from '@tippyjs/react';
import { useEffect, useRef, useState } from 'react';
import DataGrid from 'react-data-grid';
import { FaArrowLeft } from 'react-icons/fa';
import { useIntl } from 'react-intl';
import { NavLink, useSearchParams } from 'react-router-dom';

import { ALL, DAY } from '../../../services/search';
import { getDataPage, getDevices } from '../../../services/services';
import {
  getDeviceIdToNameMap,
  getFormattedShortTime,
  getFormattedTime,
  getRoundedTime,
  getWeatherIcon,
  isXS,
  roundToDecimals,
  roundTwoDigit,
  TIPPY_DELAY,
  useSearchParamState,
} from '../../../utils/Utils';
import Loader from '../../common/Loader';
import DownloadReportButton from './DownloadReportButton';
import {
  DEVICE_ID_KEYWORD,
  ENERGY_CONSUMED,
  SITE_ID_KEYWORD,
  sortRowData,
  TOTAL_ENERGY_CONS,
  TOTAL_REAL_POWER,
  transformRowData,
} from './ReportUtils';
import SearchBar from './SearchBar';

const Reports = () => {
  const windowSize = useRef([window.innerWidth, window.innerHeight]);

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
    const content = (
      <>
        <div>
          {`${row.row['weatherSummary.keyword']} `}
          {row.row['temperature'] && `${Math.round(row.row['temperature'])}°F`}
        </div>
        <div>
          {row.row['uvIndex'] &&
            `UV Index: ${roundTwoDigit(row.row['uvIndex'])}`}
        </div>
        <div>
          {row.row['precipitationIntensity'] > 0 &&
            `Precipitation: ${roundToDecimals(row.row['precipitationIntensity'], 100)} in/hr`}
        </div>
        <div>
          {row.row['cloudCover'] &&
            `Cloud Cover: ${roundTwoDigit(row.row['cloudCover'])}`}
        </div>
      </>
    );
    return (
      <Tippy content={content} delay={TIPPY_DELAY} placement='top'>
        <div className='flex h-full items-center justify-center'>
          {getWeatherIcon(
            row.row['weatherSummary.keyword'] &&
              row.row['weatherSummary.keyword'][0],
          )}
        </div>
      </Tippy>
    );
  };

  const timeRowRenderer = (row) => {
    return isXS(windowSize)
      ? getFormattedShortTime(new Date(row.row['@timestamp']))
      : row.row['time'];
  };

  const getSitesWidth = () => {
    return isXS(windowSize) ? 90 : 175;
  };

  const getNamesWidth = () => {
    return isXS(windowSize) ? 125 : 175;
  };

  const getTimeWidth = () => {
    return isXS(windowSize) ? 95 : 150;
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
    {
      key: 'time',
      name: 'Time',
      width: getTimeWidth(),
      renderCell: timeRowRenderer,
    },
    {
      key: SITE_ID_KEYWORD,
      name: 'Site',
      width: getSitesWidth(),
    },
    {
      key: DEVICE_ID_KEYWORD,
      name: 'Display Name',
      width: getNamesWidth(),
    },
    {
      key: TOTAL_REAL_POWER,
      minWidth: 100,
      name: (
        <div className='flex'>
          Power
          <div className='rdg-header-secondary text-gray-400'>&nbsp; kW</div>
        </div>
      ),
    },
    {
      key: ENERGY_CONSUMED,
      minWidth: 100,
      name: (
        <div className='flex'>
          Consumption
          <div className='rdg-header-secondary text-gray-400'>&nbsp; kWH</div>
        </div>
      ),
    },
    {
      key: TOTAL_ENERGY_CONS,
      minWidth: 100,
      name: (
        <div className='flex'>
          Total Consumption
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
      [
        'uvIndex',
        'Daylight',
        'cloudCover',
        'precipitationIntensity',
        'visibility',
      ],
    )
      .then(({ data }) => {
        setLoading(false);
        setSubLoad(false);
        setRefreshSearch(false);
        setTotal(data.hits.total.value);
        rowSetter(
          data.hits.hits
            .map((row) => transformRowData(row.fields, deviceMap, intl))
            .sort(sortRowData),
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
        <div className='flex max-w-full pl-4 pt-4 sm:pl-8 sm:pt-8'>
          <NavLink
            className='flex items-center self-start text-xs text-gray-500 hover:underline dark:text-gray-400'
            to={`../${siteId === ALL ? '' : `sites/${siteId}`}`}
          >
            <FaArrowLeft className='mr-2 inline-block' size='12' />
            {siteId === ALL && <span>Back to dashboard</span>}
            {siteId !== ALL && <span>Back to {deviceMap[siteId]}</span>}
          </NavLink>
        </div>
        <div className='flex w-full items-center justify-between p-2 py-4 sm:p-8 sm:pt-4'>
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
