import Tippy from '@tippyjs/react';
import { useIntl } from 'react-intl';

import { AVERAGE_CALCULATION } from '../../../utils/HelpText';
import {
  getPowerScalingInformation,
  roundToDecimals,
} from '../../../utils/Utils';
import FormattedLabel from '../../graphs/FormattedLabel';

export default function SummaryHeader({ dailyOutput, dailyAverageOutput }) {
  const intl = useIntl();
  const { unitPrefix, powerValue, decimals } =
    getPowerScalingInformation(dailyOutput);
  const avg = getPowerScalingInformation(dailyAverageOutput);
  const calculatePercent = (total, average) => {
    return Math.abs(Math.round((total / average) * 100));
  };
  return (
    <span className='SummaryHeader mx-6 flex flex-wrap items-baseline justify-center space-x-2 space-y-2 py-8 text-xl font-bold text-black dark:text-gray-100'>
      <span className='whitespace-nowrap text-center'>You have generated</span>
      <span className='whitespace-nowrap text-center'>
        <Tippy
          content={`${intl.formatNumber(Math.round(dailyOutput))} kWh`}
          delay={500}
          placement='top'
        >
          <span>
            <FormattedLabel
              className='mx-1 whitespace-nowrap text-center text-3xl font-bold text-brand-primary'
              label=''
              separator=' '
              unit={`${unitPrefix}Wh`}
              value={roundToDecimals(powerValue, decimals)}
            />
          </span>
        </Tippy>
        {'today.'}
      </span>
      <span className='whitespace-nowrap text-center'>
        {"That's "}
        <Tippy
          content={
            <span>
              {AVERAGE_CALCULATION}
              <br />
              <br />
              {`Your daily average is ${intl.formatNumber(
                roundToDecimals(avg.powerValue, avg.decimals),
              )}
              ${avg.unitPrefix}Wh`}
            </span>
          }
          delay={500}
          placement='top'
        >
          <span>
            <FormattedLabel
              className='mx-1 whitespace-nowrap text-center text-3xl font-bold text-brand-primary'
              label=''
              unit='%'
              value={calculatePercent(dailyOutput, dailyAverageOutput)}
            />
          </span>
        </Tippy>
        of your daily average.
      </span>
    </span>
  );
}
