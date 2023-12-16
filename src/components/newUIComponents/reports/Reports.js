import 'react-data-grid/lib/styles.css';

import { useEffect, useRef, useState } from 'react';
import DataGrid from 'react-data-grid';
import { useIntl } from 'react-intl';
import { useSearchParams } from 'react-router-dom';

import { DAY } from '../../../services/search';
import { getDataPage } from '../../../services/services';
import {
  getFormattedTime,
  getRoundedTime,
  getWeatherIcon,
  useSearchParamState,
} from '../../../utils/Utils';
import Loader from '../../newUIComponents/common/Loader';
import DownloadReportButton from './DownloadReportButton';
import SearchBar from './SearchBar';

const Reports = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [site, setSite] = useSearchParamState(
    'All Sites',
    'site',
    searchParams,
    setSearchParams,
  );
  const [device, setDevice] = useSearchParamState(
    'All Devices',
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

  const RowRenderer = (row) => {
    const temperature =
      row.row['temperature'] === undefined
        ? ''
        : Math.round(row.row['temperature']) + '°F';
    return (
      <div
        className='d-flex justify-content-center h-100'
        title={row.row['weatherSummary'] + ' ' + temperature}
      >
        {getWeatherIcon(row.row['weatherSummary'])}
      </div>
    );
  };

  const columns = [
    { key: 'weatherSummary', name: '', width: 50, renderCell: RowRenderer },
    { key: 'time', name: 'Time', width: 150 },
    { key: 'site', name: 'Site' },
    { key: 'device-name', name: 'Device Name' },
    {
      key: 'Total Energy Consumption',
      name: (
        <div className='d-flex'>
          Total Energy Cons.
          <div className='rdg-header-secondary text-text-secondary '>
            &nbsp; kWH
          </div>
        </div>
      ),
    },
    {
      key: 'Total Real Power',
      name: (
        <div className='d-flex'>
          Total Power
          <div className='rdg-header-secondary text-text-secondary'>
            &nbsp; kW
          </div>
        </div>
      ),
    },
    {
      key: 'Energy Consumed',
      name: (
        <div className='d-flex'>
          Energy Cons.{' '}
          <div className='rdg-header-secondary text-text-secondary'>
            &nbsp; kWH
          </div>
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
    document.getElementById('data-grid').classList.add('hidden');
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
    setTotal(shouldScrollToTop ? -1 : total);
    getDataPage(
      site === 'All Sites' ? null : site,
      device === 'All Devices' ? null : device,
      start,
      end,
      offset,
      500,
    )
      .then(({ data }) => {
        setLoading(false);
        setRefreshSearch(false);
        setTotal(data.hits.total.value);
        rowSetter(data.hits.hits.map((row) => getRow(row._source)));
        document.getElementById('data-grid').classList.remove('hidden');
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
    <main className='Reports flex w-full flex-col'>
      <div className='fade-in grow-1 my-8 me-5 ms-5 flex flex-col rounded-lg bg-white p-8 shadow-panel'>
        <div className='mb-10 flex w-full items-center  justify-between'>
          <span className='text-lg font-bold'>Reports</span>
          <div className='grow' />
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
        <div className='hidden·grow·rdg-holder·flex·flex-col' id='data-grid'>
          <DataGrid
            className='min-vh-70 grow'
            columns={columns}
            onScroll={handleScroll}
            ref={gridRef}
            renderers={{ noRowsFallback: <EmptyRowsRenderer /> }}
            rows={rows}
          />
        </div>
        {loading && <Loader className='align-self-center ' />}
      </div>
    </main>
  );
};

export default Reports;