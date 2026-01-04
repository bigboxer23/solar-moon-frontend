import type { ReactElement } from 'react';
import { useState } from 'react';
import { toCSV as jsons2csv } from 'react-csv/lib/core';
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

interface DownloadReportButtonProps {
  siteId: string;
  deviceId: string;
  filterErrors: string;
  start: number;
  end: number;
  timeFormatter: (date: Date) => string;
  deviceMap: Record<string, string>;
}

interface CsvHeader {
  key: string;
  label: string;
}

export default function DownloadReportButton({
  siteId,
  deviceId,
  filterErrors,
  start,
  end,
  timeFormatter,
  deviceMap,
}: DownloadReportButtonProps): ReactElement {
  const [downloading, setDownloading] = useState(false);
  const [buttonTitle, setButtonTitle] = useState('Download');
  const [percent, setPercent] = useState(0);

  const intl = useIntl();

  const headers: CsvHeader[] = [
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

  const updateStatus = (downloading: boolean, percent: number) => {
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
    localDevice: string | null,
    localSite: string | null,
    localFilterErrors: string,
    localEnd: number,
    csv: unknown[],
    interval: number,
    steps: number,
    index: number,
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
      Math.max(start, localEnd - interval + 1).toString(),
      localEnd.toString(),
      0,
      10000,
      null,
    )
      .then(({ data }) => {
        updateStatus(true, steps * index);
        if (data.hits.total?.value === 0) {
          finalizeDownload(csv);
          return;
        }
        fetchDownload(
          localDevice,
          localSite,
          localFilterErrors,
          localEnd - interval,
          csv.concat(
            data.hits.hits.map((row: { fields: unknown }) =>
              transformRowData(
                row.fields as Record<string, unknown>,
                deviceMap,
                intl,
              ),
            ),
          ),
          interval,
          steps,
          index,
        );
      })
      .catch(() => {
        updateError();
      });
  };

  const finalizeDownload = (data: unknown[]) => {
    const url = window.URL.createObjectURL(
      new Blob([jsons2csv(data as object[], headers, ',', '"')]),
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
      start.toString(),
      end.toString(),
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
      .catch(() => {
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
}
