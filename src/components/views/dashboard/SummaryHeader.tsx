import Tippy from '@tippyjs/react';
import type { ReactElement } from 'react';
import { useIntl } from 'react-intl';

import { AVERAGE_CALCULATION } from '../../../utils/HelpText';
import {
  getPowerScalingInformation,
  roundToDecimals,
  TIPPY_DELAY,
} from '../../../utils/Utils';
import FormattedLabel from '../../graphs/FormattedLabel';

interface SummaryHeaderProps {
  dailyOutput: number;
  dailyAverageOutput: number;
}

export default function SummaryHeader({
  dailyOutput,
  dailyAverageOutput,
}: SummaryHeaderProps): ReactElement {
  const intl = useIntl();
  const { unitPrefix, powerValue, decimals } =
    getPowerScalingInformation(dailyOutput);
  const avg = getPowerScalingInformation(dailyAverageOutput);
  const calculatePercent = (total: number, average: number): number => {
    return Math.abs(Math.round((total / average) * 100));
  };
  return (
    <span className='SummaryHeader mx-6 flex flex-wrap items-baseline justify-center gap-2 py-8 text-xl font-bold text-black dark:text-gray-100'>
      <span className='text-center whitespace-nowrap'>You have generated</span>
      <span className='text-center whitespace-nowrap'>
        <Tippy
          content={`${intl.formatNumber(Math.round(dailyOutput))} kWh`}
          delay={TIPPY_DELAY}
          placement='top'
        >
          <span>
            <FormattedLabel
              className='mx-1 text-center text-3xl font-bold whitespace-nowrap text-brand-primary'
              label=''
              separator=' '
              unit={`${unitPrefix}Wh`}
              value={Number(roundToDecimals(powerValue, decimals))}
            />
          </span>
        </Tippy>
        {'today.'}
      </span>
      <span className='text-center whitespace-nowrap'>
        {"That's "}
        <Tippy
          content={
            <span>
              {AVERAGE_CALCULATION}
              <br />
              <br />
              {`Your daily average is ${intl.formatNumber(
                Number(roundToDecimals(avg.powerValue, avg.decimals)),
              )}
              ${avg.unitPrefix}Wh`}
            </span>
          }
          delay={TIPPY_DELAY}
          placement='top'
        >
          <span>
            <FormattedLabel
              className='mx-1 text-center text-3xl font-bold whitespace-nowrap text-brand-primary'
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
