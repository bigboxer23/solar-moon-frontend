import { Button, Spinner } from 'react-bootstrap';
import { jsons2csv } from 'react-csv/lib/core';
import { MdDownload } from 'react-icons/md';

import { getDataPage } from '../../services/services';

const DownloadReportButton = ({ site, device, start, end, timeFormatter }) => {
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

    if (device !== null && device !== 'All Devices') {
      return fileName + ' - ' + device + '.csv';
    }
    if (site !== null && site !== 'All Sites') {
      fileName += ' - ' + site;
    }
    return fileName + '.csv';
  };
  const download = () => {
    document.getElementById('report-download-button').classList.add('disabled');
    getDataPage(
      site === 'All Sites' ? null : site,
      device === 'All Devices' ? null : device,
      start,
      end,
      0,
      10000,
    )
      .then(({ data }) => {
        let transformed = data.hits.hits.map((row) => {
          row._source.time = timeFormatter(new Date(row._source["@timestamp"]));
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
        document
          .getElementById('report-download-button')
          .classList.remove('disabled');
      })
      .catch((e) => {
        document
          .getElementById('report-download-button')
          .classList.remove('disabled');
        console.log(e);
      });
  };

  return (
    <Button
      className='ms-3'
      id='report-download-button'
      onClick={download}
      title='Download'
      variant='outline-light'
    >
      <MdDownload style={{ marginBottom: '2px' }} />
      <Spinner
        animation='border'
        as='span'
        className='d-none'
        role='status'
        size='sm'
      />
      <span className='btn-txt'>Download</span>
    </Button>
  );
};
export default DownloadReportButton;
