import { render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { IntlProvider } from 'react-intl';

import FormattedLabel from '../../../components/graphs/FormattedLabel';

// Helper to render with IntlProvider
const renderWithIntl = (component: ReactElement, locale = 'en') => {
  return render(
    <IntlProvider locale={locale} messages={{}}>
      {component}
    </IntlProvider>,
  );
};

describe('FormattedLabel', () => {
  test('renders loading state when value is -1', () => {
    renderWithIntl(<FormattedLabel value={-1} />);

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  test('renders formatted number when value is not -1', () => {
    renderWithIntl(<FormattedLabel value={1234} />);

    // FormattedNumber typically formats 1234 as "1,234" in English locale
    expect(screen.getByText(/1,234/)).toBeInTheDocument();
  });

  test('renders with label', () => {
    renderWithIntl(<FormattedLabel label='Power:' value={100} />);

    expect(screen.getByText(/Power:/)).toBeInTheDocument();
    expect(screen.getByText(/100/)).toBeInTheDocument();
  });

  test('renders with unit', () => {
    renderWithIntl(<FormattedLabel unit='kW' value={500} />);

    expect(screen.getByText(/500/)).toBeInTheDocument();
    expect(screen.getByText(/kW/)).toBeInTheDocument();
  });

  test('renders with separator', () => {
    renderWithIntl(<FormattedLabel separator=' - ' unit='watts' value={750} />);

    expect(screen.getByText(/750/)).toBeInTheDocument();
    expect(screen.getByText(/ - /)).toBeInTheDocument();
    expect(screen.getByText(/watts/)).toBeInTheDocument();
  });

  test('renders complete label with all props', () => {
    renderWithIntl(
      <FormattedLabel
        label='Current Output:'
        separator=' | '
        unit='kWh'
        value={1500}
      />,
    );

    expect(screen.getByText(/Current Output:/)).toBeInTheDocument();
    expect(screen.getByText(/1,500/)).toBeInTheDocument();
    expect(screen.getByText(/ \| /)).toBeInTheDocument();
    expect(screen.getByText(/kWh/)).toBeInTheDocument();
  });

  test('applies custom className', () => {
    const { container } = renderWithIntl(
      <FormattedLabel className='custom-class' value={100} />,
    );

    const span = container.querySelector('span');
    expect(span).toHaveClass('custom-class');
  });

  test('renders span element when not loading', () => {
    const { container } = renderWithIntl(<FormattedLabel value={100} />);

    const span = container.querySelector('span');
    expect(span).toBeInTheDocument();
    expect(span!.tagName).toBe('SPAN');
  });

  test('does not render span when loading', () => {
    const { container } = renderWithIntl(<FormattedLabel value={-1} />);

    const span = container.querySelector('span');
    expect(span).not.toBeInTheDocument();
  });

  test('handles zero value', () => {
    renderWithIntl(<FormattedLabel value={0} />);

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.queryByText('Loading')).not.toBeInTheDocument();
  });

  test('handles negative values other than -1', () => {
    renderWithIntl(<FormattedLabel value={-100} />);

    expect(screen.getByText(/-100/)).toBeInTheDocument();
    expect(screen.queryByText('Loading')).not.toBeInTheDocument();
  });

  test('handles decimal values', () => {
    renderWithIntl(<FormattedLabel value={123.45} />);

    expect(screen.getByText(/123.45/)).toBeInTheDocument();
  });

  test('handles large numbers', () => {
    renderWithIntl(<FormattedLabel value={1000000} />);

    // FormattedNumber formats large numbers with commas
    expect(screen.getByText(/1,000,000/)).toBeInTheDocument();
  });

  test('handles undefined props gracefully', () => {
    renderWithIntl(
      <FormattedLabel
        className={undefined}
        label={undefined}
        separator={undefined}
        unit={undefined}
        value={100}
      />,
    );

    expect(screen.getByText('100')).toBeInTheDocument();
  });

  test('handles null props gracefully', () => {
    renderWithIntl(
      <FormattedLabel
        className={undefined}
        label={undefined}
        separator={undefined}
        unit={undefined}
        value={100}
      />,
    );

    expect(screen.getByText('100')).toBeInTheDocument();
  });

  test('handles empty string props', () => {
    renderWithIntl(
      <FormattedLabel className='' label='' separator='' unit='' value={100} />,
    );

    expect(screen.getByText('100')).toBeInTheDocument();
  });

  test('loading state returns string not JSX', () => {
    const { container } = renderWithIntl(<FormattedLabel value={-1} />);

    // Should render just the text "Loading", not in a span
    expect(container.textContent).toBe('Loading');
    expect(container.firstChild!.nodeType).toBe(Node.TEXT_NODE);
  });

  test('renders with different locale formatting', () => {
    const { container } = render(
      <IntlProvider locale='de-DE' messages={{}}>
        <FormattedLabel value={1234.56} />
      </IntlProvider>,
    );

    // German locale uses different number formatting
    expect(container.textContent).toContain('1.234,56');
  });
});
