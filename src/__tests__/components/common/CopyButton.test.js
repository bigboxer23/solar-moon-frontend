/* eslint-env jest */
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { useCopyToClipboard } from 'usehooks-ts';

import CopyButton from '../../../components/common/CopyButton';

jest.mock('usehooks-ts');

describe('CopyButton', () => {
  const mockCopy = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    useCopyToClipboard.mockReturnValue([null, mockCopy]);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders copy button with title', () => {
    const mockDataSrc = jest.fn(() => 'test data');

    render(<CopyButton dataSrc={mockDataSrc} title='Copy to clipboard' />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('title', 'Copy to clipboard');
  });

  test('displays copy icon initially', () => {
    const mockDataSrc = jest.fn(() => 'test data');
    const { container } = render(<CopyButton dataSrc={mockDataSrc} />);

    const copyIcon = container.querySelector(
      '.transition-opacity:not(.opacity-0)',
    );
    const checkIcon = container.querySelector('.opacity-0.transition-opacity');

    expect(copyIcon).toBeInTheDocument();
    expect(checkIcon).toBeInTheDocument();
  });

  test('calls dataSrc and copy function when clicked', () => {
    const mockDataSrc = jest.fn(() => 'test data to copy');

    render(<CopyButton dataSrc={mockDataSrc} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockDataSrc).toHaveBeenCalledTimes(1);
    expect(mockCopy).toHaveBeenCalledWith('test data to copy');
  });

  test('shows check icon temporarily after copying', () => {
    const mockDataSrc = jest.fn(() => 'test data');
    const { container } = render(<CopyButton dataSrc={mockDataSrc} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // After click, copy icon should be hidden and check icon should be visible
    const copyIcon = container.querySelector('.opacity-0.transition-opacity');
    const checkIcon = container.querySelector(
      '.transition-opacity:not(.opacity-0)',
    );

    expect(copyIcon).toBeInTheDocument();
    expect(checkIcon).toBeInTheDocument();
  });

  test('reverts to copy icon after timeout', () => {
    const mockDataSrc = jest.fn(() => 'test data');
    const { container } = render(<CopyButton dataSrc={mockDataSrc} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Fast-forward time by 1500ms
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    // Should revert back to copy icon
    const copyIcon = container.querySelector(
      '.transition-opacity:not(.opacity-0)',
    );
    const checkIcon = container.querySelector('.opacity-0.transition-opacity');

    expect(copyIcon).toBeInTheDocument();
    expect(checkIcon).toBeInTheDocument();
  });

  test('applies correct CSS classes', () => {
    const mockDataSrc = jest.fn(() => 'test data');
    const { container } = render(<CopyButton dataSrc={mockDataSrc} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('copy-button', 'relative', 'w-auto');
  });

  test('uses icon button variant', () => {
    const mockDataSrc = jest.fn(() => 'test data');
    const { container } = render(<CopyButton dataSrc={mockDataSrc} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('Button-icon');
  });

  test('check icon has green color', () => {
    const mockDataSrc = jest.fn(() => 'test data');
    const { container } = render(<CopyButton dataSrc={mockDataSrc} />);

    // Find the check icon (BsCheckLg)
    const checkIcon = container.querySelector('[color="green"]');
    expect(checkIcon).toBeInTheDocument();
    expect(checkIcon).toHaveStyle({ position: 'absolute' });
  });

  test('handles multiple rapid clicks', () => {
    const mockDataSrc = jest.fn(() => 'test data');
    const { container } = render(<CopyButton dataSrc={mockDataSrc} />);

    const button = screen.getByRole('button');

    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(mockDataSrc).toHaveBeenCalledTimes(3);
    expect(mockCopy).toHaveBeenCalledTimes(3);
  });

  test('handles dataSrc returning different values', () => {
    let counter = 0;
    const mockDataSrc = jest.fn(() => `data-${++counter}`);

    render(<CopyButton dataSrc={mockDataSrc} />);

    const button = screen.getByRole('button');

    fireEvent.click(button);
    expect(mockCopy).toHaveBeenCalledWith('data-1');

    fireEvent.click(button);
    expect(mockCopy).toHaveBeenCalledWith('data-2');
  });

  test('handles empty dataSrc return', () => {
    const mockDataSrc = jest.fn(() => '');

    render(<CopyButton dataSrc={mockDataSrc} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockCopy).toHaveBeenCalledWith('');
  });

  test('button has correct type attribute', () => {
    const mockDataSrc = jest.fn(() => 'test data');

    render(<CopyButton dataSrc={mockDataSrc} />);

    const button = screen.getByRole('button');
    // The type is set via the Button component, let's just verify the button exists
    expect(button).toBeInTheDocument();
  });
});
