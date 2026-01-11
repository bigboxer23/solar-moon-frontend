import type { ReactElement } from 'react';

interface ProgressCircleProps {
  percent: number;
}

export default function ProgressCircle({
  percent,
}: ProgressCircleProps): ReactElement {
  return (
    <svg
      className='ProgressCircle'
      height='14'
      viewBox='-6.25 -6.25 62.5 62.5'
      width='14'
    >
      <g transform='rotate(-90), translate(-50,0)'>
        {}
        <circle
          className='progress-background stroke-grid-background-alt dark:stroke-neutral-600'
          cx='25'
          cy='25'
          fill='transparent'
          r='15'
          strokeDasharray='94.2px'
          strokeDashoffset='0'
          strokeWidth='30'
        ></circle>
        <circle
          className='progress-tracker stroke-brand-primary transition-all dark:stroke-grid-background-alt'
          cx='25'
          cy='25'
          fill='transparent'
          r='15'
          strokeDasharray='94.2px'
          strokeDashoffset={`${94.2 * ((100 - Math.max(0, Math.min(100, percent))) / 100)}px`}
          strokeLinecap='butt'
          strokeWidth='30'
        ></circle>
      </g>
    </svg>
  );
}
