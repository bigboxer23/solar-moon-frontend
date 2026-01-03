/* eslint-env jest */
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import DeviceBlock from '../../../components/device-block/DeviceBlock';

// Mock dependencies
jest.mock('@tippyjs/react', () => {
  return function MockTippy({
    children,
    content,
    ...props
  }: {
    children: React.ReactNode;
    content: string;
  }) {
    return (
      <div data-testid='tippy-wrapper' title={content} {...props}>
        {children}
      </div>
    );
  };
});

jest.mock('../../../utils/Utils', () => ({
  TIPPY_DELAY: 300,
  transformMultiLineForHTMLDisplay: jest.fn((text: string) => `<p>${text}</p>`),
  truncate: jest.fn((text: string, length: number) =>
    text.length > length ? `${text.substring(0, length)}...` : text,
  ),
}));

const {
  transformMultiLineForHTMLDisplay,
  truncate,
} = require('../../../utils/Utils');

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('DeviceBlock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    truncate.mockImplementation((text: string, length: number) =>
      text && text.length > length
        ? `${text.substring(0, length)}...`
        : text || '',
    );
    transformMultiLineForHTMLDisplay.mockImplementation(
      (text: string) => `<p>${text}</p>`,
    );
  });

  test('renders basic device block with title and subtitle', () => {
    const { container } = renderWithRouter(
      <DeviceBlock subtitle='Test Subtitle' title='Test Device' />,
    );

    const deviceBlock = container.querySelector('.DeviceBlock');
    expect(deviceBlock).toBeInTheDocument();
    expect(container).toHaveTextContent('Test Device');
    expect(container).toHaveTextContent('Test Subtitle');
  });

  test('applies correct base CSS classes', () => {
    const { container } = renderWithRouter(<DeviceBlock title='Test' />);

    const deviceBlock = container.querySelector('.DeviceBlock');
    expect(deviceBlock).toHaveClass(
      'DeviceBlock',
      'rounded-lg',
      'p-4',
      'sm:p-6',
      'bg-gray-50',
      'dark:bg-gray-700',
      'h-fit',
    );
  });

  test('applies custom className', () => {
    const { container } = renderWithRouter(
      <DeviceBlock className='custom-device-block' title='Test' />,
    );

    const deviceBlock = container.querySelector('.DeviceBlock');
    expect(deviceBlock).toHaveClass('custom-device-block');
  });

  test('truncates title according to truncationLength', () => {
    renderWithRouter(
      <DeviceBlock
        title='This is a very long device title that should be truncated'
        truncationLength={20}
      />,
    );

    expect(truncate).toHaveBeenCalledWith(
      'This is a very long device title that should be truncated',
      20,
    );
  });

  test('truncates subtitle according to truncationLength', () => {
    renderWithRouter(
      <DeviceBlock
        subtitle='This is a very long subtitle that should be truncated'
        title='Test'
        truncationLength={20}
      />,
    );

    expect(truncate).toHaveBeenCalledWith(
      'This is a very long subtitle that should be truncated',
      20,
    );
  });

  test('uses default truncationLength of 50', () => {
    renderWithRouter(<DeviceBlock title='Test Title' />);

    expect(truncate).toHaveBeenCalledWith('Test Title', 50);
  });

  test('displays secondaryTitle when provided', () => {
    const { container } = renderWithRouter(
      <DeviceBlock secondaryTitle='Secondary Title' title='Main Title' />,
    );

    expect(container).toHaveTextContent('Secondary Title');
    const secondaryDiv = container.querySelector('.flex.text-xs.text-gray-400');
    expect(secondaryDiv).toHaveTextContent('Secondary Title');
  });

  test('does not render secondaryTitle section when not provided', () => {
    const { container } = renderWithRouter(<DeviceBlock title='Main Title' />);

    const secondaryDiv = container.querySelector('.flex.text-xs.text-gray-400');
    expect(secondaryDiv).not.toBeInTheDocument();
  });

  test('renders stat blocks in grid', () => {
    const statBlocks = [
      <div data-testid='stat-1' key='1'>
        Stat 1
      </div>,
      <div data-testid='stat-2' key='2'>
        Stat 2
      </div>,
      <div data-testid='stat-3' key='3'>
        Stat 3
      </div>,
    ];

    renderWithRouter(<DeviceBlock statBlocks={statBlocks} title='Test' />);

    expect(
      document.querySelector('[data-testid="stat-1"]'),
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-testid="stat-2"]'),
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-testid="stat-3"]'),
    ).toBeInTheDocument();
  });

  test('applies correct grid classes to stat blocks container', () => {
    const { container } = renderWithRouter(
      <DeviceBlock statBlocks={[<div key='1'>Test</div>]} title='Test' />,
    );

    const gridContainer = container.querySelector(
      '.my-2.grid.grid-cols-2.gap-1.sm\\:gap-2',
    );
    expect(gridContainer).toBeInTheDocument();
  });

  test('renders body content when provided', () => {
    const bodyContent = <div data-testid='body-content'>Body Content</div>;

    renderWithRouter(<DeviceBlock body={bodyContent} title='Test' />);

    expect(
      document.querySelector('[data-testid="body-content"]'),
    ).toBeInTheDocument();
  });

  test('does not render body section when not provided', () => {
    const { container } = renderWithRouter(<DeviceBlock title='Test' />);

    // The body div should not exist if no body content is provided
    const statBlocksContainer = container.querySelector('.my-2.grid');
    expect(statBlocksContainer).toBeInTheDocument();

    // There should be no additional div after the stat blocks container
    const bodyDiv = statBlocksContainer?.nextElementSibling;
    expect(bodyDiv).toBeNull();
  });

  test('renders informational error icon with tooltip', () => {
    renderWithRouter(
      <DeviceBlock
        informationalErrors='Error message here'
        informationalErrorsLink='/error-link'
        title='Test'
      />,
    );

    expect(
      document.querySelector('[data-testid="tippy-wrapper"]'),
    ).toBeInTheDocument();
    expect(transformMultiLineForHTMLDisplay).toHaveBeenCalledWith(
      'Error message here',
    );

    const errorLink = document.querySelector('a[href="/error-link"]');
    expect(errorLink).toBeInTheDocument();
  });

  test('does not render informational error icon when null', () => {
    renderWithRouter(
      <DeviceBlock
        informationalErrors={null}
        informationalErrorsLink='/error-link'
        title='Test'
      />,
    );

    const errorLink = document.querySelector('a[href="/error-link"]');
    expect(errorLink).not.toBeInTheDocument();
  });

  test('renders report link when provided', () => {
    renderWithRouter(<DeviceBlock reportLink='/device-report' title='Test' />);

    const reportLink = document.querySelector('a[href="/device-report"]');
    expect(reportLink).toBeInTheDocument();
    expect(reportLink).toHaveAttribute('title', 'To device report');
  });

  test('does not render report link when not provided', () => {
    const { container } = renderWithRouter(<DeviceBlock title='Test' />);

    const reportLink = container.querySelector('a[title="To device report"]');
    expect(reportLink).not.toBeInTheDocument();
  });

  test('displays hover title when title is truncated', () => {
    const longTitle = 'This is a very long title that will be truncated';
    truncate.mockReturnValueOnce('This is a very long title th...');

    const { container } = renderWithRouter(
      <DeviceBlock title={longTitle} truncationLength={30} />,
    );

    const titleDiv = container.querySelector('div[title]');
    expect(titleDiv).toHaveAttribute('title', longTitle);
  });

  test('does not display hover title when title is not truncated', () => {
    const shortTitle = 'Short Title';
    truncate.mockReturnValueOnce(shortTitle);

    const { container } = renderWithRouter(
      <DeviceBlock title={shortTitle} truncationLength={50} />,
    );

    const titleDiv = container.querySelector('div[title=""]');
    expect(titleDiv).toBeInTheDocument();
  });

  test('displays hover subtitle when subtitle is truncated', () => {
    const longSubtitle = 'This is a very long subtitle that will be truncated';
    const shortTitle = 'Title';

    truncate
      .mockReturnValueOnce(shortTitle) // For title
      .mockReturnValueOnce('This is a very long subtitl...'); // For subtitle

    const { container } = renderWithRouter(
      <DeviceBlock
        subtitle={longSubtitle}
        title={shortTitle}
        truncationLength={30}
      />,
    );

    const subtitleDiv = container.querySelector(
      '.ml-2.text-sm.text-gray-400[title]',
    );
    expect(subtitleDiv).toHaveAttribute('title', longSubtitle);
  });

  test('renders both informational error and report link simultaneously', () => {
    renderWithRouter(
      <DeviceBlock
        informationalErrors='Error info'
        informationalErrorsLink='/error-link'
        reportLink='/device-report'
        title='Test'
      />,
    );

    expect(document.querySelector('a[href="/error-link"]')).toBeInTheDocument();
    expect(
      document.querySelector('a[href="/device-report"]'),
    ).toBeInTheDocument();
  });

  test('handles empty stat blocks array', () => {
    const { container } = renderWithRouter(
      <DeviceBlock statBlocks={[]} title='Test' />,
    );

    const gridContainer = container.querySelector('.my-2.grid');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toBeEmptyDOMElement();
  });

  test('applies correct text styling to title and subtitle', () => {
    const { container } = renderWithRouter(
      <DeviceBlock subtitle='Test Subtitle' title='Test Title' />,
    );

    const titleSpan = container.querySelector(
      '.flex.grow.items-center.text-base.font-bold.text-black.dark\\:text-gray-100',
    );
    expect(titleSpan).toBeInTheDocument();

    const subtitleDiv = container.querySelector('.ml-2.text-sm.text-gray-400');
    expect(subtitleDiv).toBeInTheDocument();
  });
});
