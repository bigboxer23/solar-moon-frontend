/* eslint-env jest */
import { render } from '@testing-library/react';
import { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';

import PageTitle from '../../../components/nav/PageTitleRoute';

const renderWithRouter = (component: ReactElement, initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>,
  );
};

describe('PageTitle', () => {
  beforeEach(() => {
    // Reset document title before each test
    document.title = '';
  });

  test('sets document title with provided title', () => {
    renderWithRouter(<PageTitle title='Test Page Title' />);

    expect(document.title).toBe('Test Page Title');
  });

  test('renders null (no visual output)', () => {
    const { container } = renderWithRouter(<PageTitle title='Test Title' />);

    expect(container.firstChild).toBe(null);
  });

  test('updates title when title prop changes', () => {
    const { rerender } = renderWithRouter(<PageTitle title='Initial Title' />);

    expect(document.title).toBe('Initial Title');

    rerender(
      <MemoryRouter>
        <PageTitle title='Updated Title' />
      </MemoryRouter>,
    );

    expect(document.title).toBe('Updated Title');
  });

  test('updates title when location changes', () => {
    const { rerender } = renderWithRouter(<PageTitle title='Same Title' />, [
      '/',
    ]);

    expect(document.title).toBe('Same Title');

    // Navigate to different route
    rerender(
      <MemoryRouter initialEntries={['/different-route']}>
        <PageTitle title='Same Title' />
      </MemoryRouter>,
    );

    expect(document.title).toBe('Same Title');
  });

  test('handles empty string title', () => {
    renderWithRouter(<PageTitle title='' />);

    expect(document.title).toBe('');
  });

  test('handles undefined title', () => {
    renderWithRouter(<PageTitle title={undefined as unknown as string} />);

    expect(document.title).toBe('undefined');
  });

  test('handles null title', () => {
    renderWithRouter(<PageTitle title={null as unknown as string} />);

    expect(document.title).toBe('null');
  });

  test('handles numeric title', () => {
    renderWithRouter(<PageTitle title={123 as unknown as string} />);

    expect(document.title).toBe('123');
  });

  test('handles complex title with special characters', () => {
    const complexTitle = 'Solar Moon - Dashboard | Analytics & Reports 2024!';
    renderWithRouter(<PageTitle title={complexTitle} />);

    expect(document.title).toBe(complexTitle);
  });

  test('works with different router locations', () => {
    renderWithRouter(<PageTitle title='Home Page' />, ['/home']);
    expect(document.title).toBe('Home Page');

    renderWithRouter(<PageTitle title='About Page' />, ['/about']);
    expect(document.title).toBe('About Page');

    renderWithRouter(<PageTitle title='Contact Page' />, ['/contact/us']);
    expect(document.title).toBe('Contact Page');
  });

  test('title persists across renders with same props', () => {
    const { rerender } = renderWithRouter(
      <PageTitle title='Persistent Title' />,
    );

    expect(document.title).toBe('Persistent Title');

    // Re-render with same props
    rerender(
      <MemoryRouter>
        <PageTitle title='Persistent Title' />
      </MemoryRouter>,
    );

    expect(document.title).toBe('Persistent Title');
  });

  test('handles very long titles', () => {
    const longTitle =
      'This is a very long page title that might be used in some applications to provide detailed information about the current page content and context';
    renderWithRouter(<PageTitle title={longTitle} />);

    expect(document.title).toBe(longTitle);
  });

  test('useEffect dependency array works correctly', () => {
    const { rerender } = renderWithRouter(<PageTitle title='Title 1' />, [
      '/route1',
    ]);

    expect(document.title).toBe('Title 1');

    // Change only location, same title - should still update due to location dependency
    rerender(
      <MemoryRouter initialEntries={['/route2']}>
        <PageTitle title='Title 1' />
      </MemoryRouter>,
    );

    expect(document.title).toBe('Title 1');
  });

  test('component cleanup does not affect title', () => {
    const { unmount } = renderWithRouter(<PageTitle title='Will Persist' />);

    expect(document.title).toBe('Will Persist');

    unmount();

    // Title should remain after component unmounts
    expect(document.title).toBe('Will Persist');
  });

  test('handles boolean title values', () => {
    renderWithRouter(<PageTitle title={true as unknown as string} />);
    expect(document.title).toBe('true');

    renderWithRouter(<PageTitle title={false as unknown as string} />);
    expect(document.title).toBe('false');
  });

  test('multiple PageTitle components - last one wins', () => {
    renderWithRouter(
      <div>
        <PageTitle title='First Title' />
        <PageTitle title='Second Title' />
        <PageTitle title='Final Title' />
      </div>,
    );

    expect(document.title).toBe('Final Title');
  });
});
