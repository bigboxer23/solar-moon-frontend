import 'react-data-grid/lib/styles.css';

import Tippy from '@tippyjs/react';
import type { ReactElement } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { Column, DataGridHandle, RenderCellProps } from 'react-data-grid';
import { DataGrid } from 'react-data-grid';
import { FaArrowLeft } from 'react-icons/fa';
import { useIntl } from 'react-intl';
import { NavLink, useSearchParams } from 'react-router-dom';

import { ALL, DAY } from '../../../services/search';
import { getDataPage, getDevices } from '../../../services/services';
import type { Device } from '../../../types/models';
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
  DISPLAY_NAME,
  ENERGY_CONSUMED,
  INFORMATIONAL_ERROR,
  type RowData,
  SITE_ID_KEYWORD,
  sortRowData,
  TOTAL_ENERGY_CONS,
  TOTAL_REAL_POWER,
  transformRowData,
} from './ReportUtils';
import SearchBar from './SearchBar';

export default function Reports(): ReactElement {
  const windowSize = useRef<[number, number]>([
    window.innerWidth,
    window.innerHeight,
  ]);

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

  const [startStr, setStartStr] = useSearchParamState(
    getRoundedTime(false, DAY).getTime().toString(),
    'start',
    searchParams,
    setSearchParams,
  );
  const start = Number(startStr);
  const setStart = (value: number) => setStartStr(value.toString());

  const [endStr, setEndStr] = useSearchParamState(
    getRoundedTime(true, 0).getTime().toString(),
    'end',
    searchParams,
    setSearchParams,
  );
  const end = Number(endStr);
  const setEnd = (value: number) => setEndStr(value.toString());
  const [filterErrors, setFilterErrors] = useSearchParamState(
    'false',
    'err',
    searchParams,
    setSearchParams,
  );
  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceMap, setDeviceMap] = useState<Record<string, string>>({});
  const [rows, setRows] = useState<RowData[]>([]);
  const [total, setTotal] = useState(-1);
  const [refreshSearch, setRefreshSearch] = useState(false);
  const gridRef = useRef<DataGridHandle>(null);

  const intl = useIntl();
  useEffect(() => {
    getDevices().then(({ data }) => {
      setDevices(data || []);
      setDeviceMap(getDeviceIdToNameMap(data || []));
      setInit(true);
    });
  }, []);

  useEffect(() => {
    if (!init) {
      return;
    }
    fetchData(0, (rows) => setRows(rows), true);
  }, [devices, init]);

  const WeatherRowRenderer = (row: RenderCellProps<RowData>) => {
    const temp = row.row['temperature'] as number | undefined;
    const uv = row.row['uvIndex'] as number | undefined;
    const precip = row.row['precipitationIntensity'] as number | undefined;
    const cloud = row.row['cloudCover'] as number | undefined;
    const weatherIcon = row.row['weatherIcon.keyword'] as string[] | undefined;

    const content = (
      <>
        <div>
          {`${row.row['weatherSummary.keyword']} `}
          {temp && `${Math.round(temp)}°F`}
        </div>
        <div>{uv && `UV Index: ${roundTwoDigit(uv)}`}</div>
        <div>
          {precip! > 0 &&
            `Precipitation: ${roundToDecimals(precip!, 100)} in/hr`}
        </div>
        <div>{cloud && `Cloud Cover: ${roundTwoDigit(cloud)}`}</div>
      </>
    );
    return (
      <Tippy content={content} delay={TIPPY_DELAY} placement='top'>
        <div className='flex h-full items-center justify-center'>
          {getWeatherIcon(weatherIcon?.[0] || '')}
        </div>
      </Tippy>
    );
  };

  const timeRowRenderer = (row: RenderCellProps<RowData>) => {
    const timestamp = row.row['@timestamp'] as number | undefined;
    const time = row.row['time'] as string | undefined;
    return isXS(windowSize)
      ? getFormattedShortTime(new Date(timestamp!))
      : time;
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

  const columns: Column<RowData>[] = [
    {
      key: 'weatherSummary.keyword',
      name: (
        <div
          className='flex h-full items-center justify-center'
          title='Weather Conditions'
        >
          {getWeatherIcon('partly-cloudy-day')}
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
      key: DISPLAY_NAME,
      name: 'Display Name',
      width: getNamesWidth(),
    },
    {
      key: TOTAL_REAL_POWER,
      minWidth: 100,
      name: (
        <div className='flex items-center'>
          Power
          <div className='rdg-header-secondary text-gray-400'>&nbsp; kW</div>
        </div>
      ),
    },
    {
      key: ENERGY_CONSUMED,
      minWidth: 100,
      name: (
        <div className='flex items-center'>
          Consumption
          <div className='rdg-header-secondary text-gray-400'>&nbsp; kWH</div>
        </div>
      ),
    },
    {
      key: TOTAL_ENERGY_CONS,
      minWidth: 100,
      name: (
        <div className='flex items-center'>
          Total Consumption
          <div className='rdg-header-secondary text-gray-400'>&nbsp; kWH</div>
        </div>
      ),
    },
  ];
  if (filterErrors === 'true') {
    columns[columns.length] = {
      key: INFORMATIONAL_ERROR,
      minWidth: 100,
      name: <div className='flex items-center'>Informational Error</div>,
    };
  }
  useEffect(() => {
    if (loading) {
      return;
    }
    fetchData(0, (rows) => setRows(rows), true);
  }, [siteId, deviceId, start, end, filterErrors]);

  useEffect(() => {
    if (loading || !refreshSearch) {
      return;
    }
    fetchData(0, (rows) => setRows(rows), true);
  }, [refreshSearch]);

  const fetchData = (
    offset: number,
    rowSetter: (rows: RowData[]) => void,
    shouldScrollToTop: boolean,
  ) => {
    setLoading(true);
    setSubLoad(offset > 0);
    setTotal(shouldScrollToTop ? -1 : total);
    getDataPage(
      deviceId === ALL ? null : deviceId,
      siteId === ALL ? null : siteId,
      filterErrors,
      start.toString(),
      end.toString(),
      offset,
      500,
      [
        'uvIndex',
        'Daylight',
        'cloudCover',
        'precipitationIntensity',
        'visibility',
        INFORMATIONAL_ERROR,
        'weatherIcon.keyword',
      ],
    )
      .then(({ data }) => {
        setLoading(false);
        setSubLoad(false);
        setRefreshSearch(false);
        setTotal(data.hits.total?.value ?? 0);
        rowSetter(
          data.hits.hits
            .map((row: { fields: unknown }) =>
              transformRowData(
                row.fields as Record<string, unknown>,
                deviceMap,
                intl,
              ),
            )
            .sort(sortRowData),
        );
        if (shouldScrollToTop) {
          scrollToTop();
        }
      })
      .catch((e) => {
        console.log(e);
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
    gridRef.current?.scrollToCell({ rowIdx: 0, idx: 0 });
  };

  async function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    if (loading || !isAtBottom(event) || rows.length === total) return;
    fetchData(rows.length, (r) => setRows([...rows, ...r]), false);
  }

  const isAtBottom = ({ currentTarget }: React.UIEvent<HTMLDivElement>) => {
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
            filterErrors={filterErrors}
            refreshSearch={refreshSearch}
            setDeviceId={setDeviceId}
            setEnd={setEnd}
            setFilterErrors={setFilterErrors}
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
            filterErrors={filterErrors}
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
}
