import { useEffect, useRef, useState } from 'react';
import { Card, CardBody, CardHeader } from 'react-bootstrap';
import DataGrid from 'react-data-grid';
import { useSearchParams } from 'react-router-dom';

import { MONTH } from '../../services/search';
import { getAlarmData, getDevices } from '../../services/services';
import {
  formatMessage,
  getFormattedDaysHoursMinutes,
  getFormattedTime,
  getRoundedTime,
  useSearchParamState,
} from '../../utils/Utils';
import Loader from '../common/Loader';
import SearchBar from '../reports/SearchBar';

const Alarms = () => {
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
  const [devices, setDevices] = useState([]);
  const [start, setStart] = useSearchParamState(
    getRoundedTime(false, MONTH).getTime(),
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
  const gridRef = useRef(null);
  const [rows, setRows] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const [fetching, setFetching] = useState(false);

  const columns = [
    {
      key: 'formattedStartDate',
      name: 'Start Date',
      width: 150,
    },
    {
      key: 'formattedEndDate',
      name: 'End Date',
      width: 150,
    },
    {
      key: 'duration',
      name: 'Duration',
      width: 100,
    },
    {
      key: 'siteId',
      name: 'Site',
      width: 150,
    },
    { key: 'deviceId', name: 'Device', width: 150 },
    { key: 'message', name: 'Message' },
  ];

  const EmptyRowsRenderer = () => {
    return (
      <div
        className='fw-bolder h6 p-3'
        style={{ textAlign: 'center', gridColumn: '1/-1' }}
      >
        {alarms.length === 0
          ? 'All devices reporting as healthy!'
          : 'Nothing matches active filters.'}
      </div>
    );
  };

  const getRow = function (row) {
    row.formattedStartDate = getFormattedTime(new Date(row['startDate']));
    if (row['endDate'] > row['startDate']) {
      row.formattedEndDate = getFormattedTime(new Date(row['endDate']));
      row.duration = getFormattedDaysHoursMinutes(
        row['endDate'] - row['startDate'],
      );
    }
    row.message = formatMessage(row.message);
    row.siteId =
      devices.find((device) => device.id === row.siteId)?.name || row.siteId;
    let d = devices.find((device) => device.id === row.deviceId);
    row.deviceId = d?.name || d?.deviceName || row.deviceId;
    return row;
  };

  const fetchDevices = () => {
    getDevices()
      .then(({ data }) => {
        setDevices(data);
        setFetching(false);
      })
      .catch(() => setFetching(false));
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  useEffect(() => {
    if (devices.length === 0) {
      return;
    }
    getAlarmData()
      .then(({ data }) => {
        setLoading(false);
        setAlarms(
          data
            .sort((row, row2) => row2.startDate - row.startDate)
            .map((row) => getRow(row)),
        );
        document.getElementById('data-grid').classList.remove('d-none');
      })
      .catch((e) => {
        setLoading(false);
      });
  }, [devices]);

  useEffect(() => {
    setRows(
      alarms
        .filter((alarm) => site === 'All Sites' || alarm.siteId === site)
        .filter(
          (alarm) => device === 'All Devices' || alarm.deviceId === device,
        )
        .filter((alarm) => alarm.startDate > start)
        .filter((alarm) => alarm.endDate < end),
    );
  }, [alarms, site, device, start, end]);

  useEffect(() => {
    if (loading || !fetching) {
      return;
    }
    fetchDevices();
  }, [fetching]);

  return (
    <div className='root-page min-vh-95 d-flex flex-column container'>
      <Card className='grow-1'>
        <CardHeader className='d-flex'>
          <SearchBar
            defaultSearchPeriod={MONTH}
            device={device}
            devices={devices}
            end={end}
            refreshSearch={fetching}
            setDevice={setDevice}
            setDevices={setDevices}
            setEnd={setEnd}
            setRefreshSearch={setFetching}
            setSite={setSite}
            setStart={setStart}
            site={site}
            start={start}
          />
        </CardHeader>
        <CardBody
          className='d-flex flex-column rdg-holder d-none'
          id='data-grid'
        >
          <DataGrid
            className='rdg-dark grow-1'
            columns={columns}
            ref={gridRef}
            renderers={{ noRowsFallback: <EmptyRowsRenderer /> }}
            rowClass={(row) => {
              return row.state === 1 ? 'active-alarm' : undefined;
            }}
            rows={rows}
          />
        </CardBody>
        <Loader content='' deviceCount={rows.length} loading={loading} />
      </Card>
    </div>
  );
};

export default Alarms;
