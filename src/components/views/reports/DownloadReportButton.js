import { useState } from 'react';
import { jsons2csv } from 'react-csv/lib/core';
import { FaDownload } from 'react-icons/fa';
import { useIntl } from 'react-intl';
import { toast, ToastContainer } from 'react-toastify';

import { ALL, DAY } from '../../../services/search';
import { getDataPage, getDownloadPageSize } from '../../../services/services';
import Button from '../../common/Button';
import Spinner from '../../common/Spinner';
import { transformRowData } from './ReportUtils';

const DownloadReportButton = ({ site, device, start, end, timeFormatter }) => {
  const [downloading, setDownloading] = useState(false);
  const [buttonTitle, setButtonTitle] = useState('Download');
  const intl = useIntl();

  const headers = [
    { key: 'time', label: 'Time' },
    { key: 'site.keyword', label: 'Site' },
    { key: 'device-name.keyword', label: 'Device Name' },
    {
      key: 'Total Energy Consumption',
      label: 'Total Energy Consumption (kWH)',
    },
    {
      key: 'Total Real Power',
      label: 'Total Power (kW)',
    },
    {
      key: 'Energy Consumed',
      label: 'Energy Consumed (kWH)',
    },
  ];

  const getFileName = () => {
    let fileName =
      timeFormatter(new Date(Number(start))) +
      ' - ' +
      timeFormatter(new Date(Number(end)));

    if (device !== null && device !== ALL) {
      return fileName + ' - ' + device + '.csv';
    }
    if (site !== null && site !== ALL) {
      fileName += ' - ' + site;
    }
    return fileName + '.csv';
  };

  const updateStatus = (downloading, percent) => {
    setDownloading(downloading);
    if (percent === 100) {
      setButtonTitle('Download');
      return;
    }
    setButtonTitle(percent + '% Downloading');
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
    localSite,
    localDevice,
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
      localSite,
      localDevice,
      Math.max(start, localEnd - interval + 1),
      localEnd,
      0,
      10000,
    )
      .then(({ data }) => {
        updateStatus(true, steps * index);
        if (data.hits.total.value === 0) {
          finalizeDownload(csv);
          return;
        }
        fetchDownload(
          localSite,
          localDevice,
          localEnd - interval,
          csv.concat(
            data.hits.hits.map((row) => transformRowData(row.fields, intl)),
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
      site === ALL ? null : site,
      device === ALL ? null : device,
      start,
      end,
      0,
      10000,
    )
      .then(({ data }) => {
        fetchDownload(
          site === ALL ? null : site,
          device === ALL ? null : device,
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
      {downloading && <Spinner />}
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
