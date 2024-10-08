import { useState } from 'react';
import { jsons2csv } from 'react-csv/lib/core';
import { FaDownload } from 'react-icons/fa';
import { useIntl } from 'react-intl';
import { toast, ToastContainer } from 'react-toastify';

import { ALL, DAY } from '../../../services/search';
import { getDataPage, getDownloadPageSize } from '../../../services/services';
import Button from '../../common/Button';
import ProgressCircle from '../../common/ProgressCircle';
import {
  DEVICE_ID_KEYWORD,
  ENERGY_CONSUMED,
  SITE_ID_KEYWORD,
  TOTAL_ENERGY_CONS,
  TOTAL_REAL_POWER,
  transformRowData,
} from './ReportUtils';

const DownloadReportButton = ({
  siteId,
  deviceId,
  filterErrors,
  start,
  end,
  timeFormatter,
  deviceMap,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [buttonTitle, setButtonTitle] = useState('Download');
  const [percent, setPercent] = useState(0);

  const intl = useIntl();

  const headers = [
    { key: 'time', label: 'Time' },
    { key: SITE_ID_KEYWORD, label: 'Site' },
    { key: DEVICE_ID_KEYWORD, label: 'Display Name' },
    {
      key: TOTAL_ENERGY_CONS,
      label: 'Total Energy Consumption (kWH)',
    },
    {
      key: TOTAL_REAL_POWER,
      label: 'Total Power (kW)',
    },
    {
      key: ENERGY_CONSUMED,
      label: 'Energy Consumed (kWH)',
    },
  ];

  const getFileName = () => {
    let fileName = `${timeFormatter(new Date(Number(start)))} - ${timeFormatter(
      new Date(Number(end)),
    )}`;

    if (deviceId !== null && deviceId !== ALL) {
      return `${fileName} - ${deviceMap[deviceId]}.csv`;
    }
    if (siteId !== null && siteId !== ALL) {
      fileName += ` - ${deviceMap[siteId]}`;
    }
    return `${fileName}.csv`;
  };

  const updateStatus = (downloading, percent) => {
    setDownloading(downloading);
    if (percent === 100) {
      setButtonTitle('Download');
      setPercent(0);
      return;
    }
    setButtonTitle('Downloading');
    setPercent(percent);
  };

  const updateError = () => {
    updateStatus(false, 100);
    toast.error('Error creating report file', {
      position: 'bottom-right',
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: 'light',
    });
  };

  const fetchDownload = (
    localDevice,
    localSite,
    localFilterErrors,
    localEnd,
    csv,
    interval,
    steps,
    index,
  ) => {
    if (start >= localEnd) {
      finalizeDownload(csv);
      return;
    }
    index++;
    getDataPage(
      localDevice,
      localSite,
      localFilterErrors,
      Math.max(start, localEnd - interval + 1),
      localEnd,
      0,
      10000,
      null,
    )
      .then(({ data }) => {
        updateStatus(true, steps * index);
        if (data.hits.total.value === 0) {
          finalizeDownload(csv);
          return;
        }
        fetchDownload(
          localDevice,
          localSite,
          localFilterErrors,
          localEnd - interval,
          csv.concat(
            data.hits.hits.map((row) =>
              transformRowData(row.fields, deviceMap, intl),
            ),
          ),
          interval,
          steps,
          index,
        );
      })
      .catch((e) => {
        updateError();
      });
  };

  const finalizeDownload = (data) => {
    const url = window.URL.createObjectURL(
      new Blob([jsons2csv(data, headers, ',', '"')]),
    );
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', getFileName());
    document.body.appendChild(link);
    link.click();
    link.remove();
    updateStatus(false, 100);
  };

  const download = () => {
    updateStatus(true, 0);
    getDownloadPageSize(
      deviceId === ALL ? null : deviceId,
      siteId === ALL ? null : siteId,
      filterErrors,
      start,
      end,
      0,
      10000,
    )
      .then(({ data }) => {
        fetchDownload(
          deviceId === ALL ? null : deviceId,
          siteId === ALL ? null : siteId,
          filterErrors,
          end,
          [],
          data * DAY,
          Math.round(100 / ((end - start) / DAY / data)),
          0,
        );
      })
      .catch((e) => {
        updateError();
      });
  };

  return (
    <Button
      buttonProps={{
        title: 'Download',
      }}
      disabled={downloading}
      onClick={download}
      variant='outline-secondary'
    >
      {!downloading && <FaDownload />}
      {downloading && <ProgressCircle percent={percent} />}
      <span className='hidden whitespace-nowrap sm:ml-2 sm:block'>
        {buttonTitle}
      </span>
      <ToastContainer
        autoClose={2500}
        closeOnClick
        draggable
        hideProgressBar={false}
        newestOnTop={false}
        pauseOnFocusLoss
        pauseOnHover
        position='bottom-right'
        rtl={false}
        theme='light'
      />
    </Button>
  );
};
export default DownloadReportButton;
