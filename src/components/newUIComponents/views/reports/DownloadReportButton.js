import classNames from 'classnames';
import { useState } from 'react';
import { jsons2csv } from 'react-csv/lib/core';
import { FaDownload, FaSpinner } from 'react-icons/fa';

import { ALL } from '../../../../services/search';
import { getDataPage } from '../../../../services/services';
import Button from '../../common/Button';
import Spinner from '../../common/Spinner';

const DownloadReportButton = ({ site, device, start, end, timeFormatter }) => {
  const [downloading, setDownloading] = useState(false);

  const headers = [
    { key: 'time', label: 'Time' },
    { key: 'site', label: 'Site' },
    { key: 'device-name', label: 'Device Name' },
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

  const download = () => {
    setDownloading(true);

    getDataPage(
      site === ALL ? null : site,
      device === ALL ? null : device,
      start,
      end,
      0,
      10000,
    )
      .then(({ data }) => {
        const transformed = data.hits.hits.map((row) => {
          row._source.time = timeFormatter(new Date(row._source['@timestamp']));
          return row._source;
        });
        const url = window.URL.createObjectURL(
          new Blob([jsons2csv(transformed, headers, ',', '"')]),
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', getFileName());
        document.body.appendChild(link);
        link.click();
        link.remove();

        setDownloading(false);
      })
      .catch((e) => {
        setDownloading(false);
        console.log(e);
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
      <span className='hidden sm:ml-2 sm:block'>Download</span>
    </Button>
  );
};
export default DownloadReportButton;
