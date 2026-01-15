import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import Modal, {
  ModalFooter,
  ModalHeader,
} from '../../../components/common/Modal';

describe('Modal', () => {
  test('renders nothing when isOpen is false', () => {
    render(
      <Modal isOpen={false}>
        <div>Modal content</div>
      </Modal>,
    );

    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  test('renders modal when isOpen is true', () => {
    render(
      <Modal isOpen={true}>
        <div>Modal content</div>
      </Modal>,
    );

    expect(screen.getByText('Modal content')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('applies default medium size', () => {
    render(
      <Modal isOpen={true}>
        <div>Modal content</div>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('sm:w-[32rem]');
  });

  test('applies small size', () => {
    render(
      <Modal isOpen={true} size='sm'>
        <div>Modal content</div>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('sm:w-64');
  });

  test('applies large size', () => {
    render(
      <Modal isOpen={true} size='lg'>
        <div>Modal content</div>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('sm:w-[50rem]');
  });

  test('applies modal styling classes', () => {
    render(
      <Modal isOpen={true}>
        <div>Modal content</div>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass(
      'Modal',
      'fixed',
      '!top-[10%]',
      'z-10',
      '!mx-auto',
      'w-full',
      'rounded-xl',
      'bg-white',
      'shadow-modal',
      'dark:bg-gray-800',
      'sm:!top-1/4',
    );
  });

  test('renders modal as portal in document.body', () => {
    const { container } = render(
      <Modal isOpen={true}>
        <div>Portal content</div>
      </Modal>,
    );

    // Modal should not be in the container (since it's portaled)
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();

    // Modal content should be accessible through screen queries
    expect(screen.getByText('Portal content')).toBeInTheDocument();
  });

  test('sets open attribute correctly', () => {
    render(
      <Modal isOpen={true}>
        <div>Modal content</div>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('open');
  });

  test('handles children rendering correctly', () => {
    render(
      <Modal isOpen={true}>
        <div>First child</div>
        <span>Second child</span>
      </Modal>,
    );

    expect(screen.getByText('First child')).toBeInTheDocument();
    expect(screen.getByText('Second child')).toBeInTheDocument();
  });

  test('handles complex children', () => {
    const complexChild = (
      <div>
        <h1>Title</h1>
        <p>Description</p>
        <button>Action</button>
      </div>
    );

    render(<Modal isOpen={true}>{complexChild}</Modal>);

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  test('defaults isOpen to false', () => {
    render(
      <Modal>
        <div>Default modal</div>
      </Modal>,
    );

    expect(screen.queryByText('Default modal')).not.toBeInTheDocument();
  });
});

describe('ModalHeader', () => {
  test('renders header with label', () => {
    render(<ModalHeader label='Test Modal' />);

    const header = screen.getByText('Test Modal');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('ModalHeader', 'text-lg', 'font-bold');
  });

  test('applies header styling classes', () => {
    const { container } = render(<ModalHeader label='Test Modal' />);

    const headerWrapper = container.querySelector('.ModalHeader');
    expect(headerWrapper).toHaveClass(
      'flex',
      'items-center',
      'justify-between',
      'border-b',
      'border-gray-200',
      'px-6',
      'py-4',
    );
  });

  test('renders close button when onCloseClick provided', () => {
    const mockClose = vi.fn();
    render(<ModalHeader label='Test Modal' onCloseClick={mockClose} />);

    const closeButton = screen.getByRole('button');
    expect(closeButton).toBeInTheDocument();
  });

  test('does not render close button when onCloseClick not provided', () => {
    render(<ModalHeader label='Test Modal' />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('calls onCloseClick when close button is clicked', () => {
    const mockClose = vi.fn();
    render(<ModalHeader label='Test Modal' onCloseClick={mockClose} />);

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  test('close button has icon variant', () => {
    const mockClose = vi.fn();
    render(<ModalHeader label='Test Modal' onCloseClick={mockClose} />);

    const closeButton = screen.getByRole('button');
    expect(closeButton).toHaveClass('Button-icon');
  });

  test('handles empty label', () => {
    const { container } = render(<ModalHeader label='' />);

    const header = container.querySelector('h2.ModalHeader')!;
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent('');
  });

  test('handles undefined onCloseClick gracefully', () => {
    render(<ModalHeader label='Test Modal' onCloseClick={undefined} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('handles null onCloseClick gracefully', () => {
    render(
      <ModalHeader
        label='Test Modal'
        onCloseClick={null as unknown as () => void}
      />,
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

describe('ModalFooter', () => {
  test('renders footer with children', () => {
    render(
      <ModalFooter>
        <button>Cancel</button>
        <button>Confirm</button>
      </ModalFooter>,
    );

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  test('applies footer styling classes', () => {
    const { container } = render(
      <ModalFooter>
        <div>Footer content</div>
      </ModalFooter>,
    );

    const footer = container.querySelector('.ModalFooter');
    expect(footer).toHaveClass(
      'ModalFooter',
      'justify-end',
      'w-full',
      'flex',
      'px-6',
      'pb-4',
      'pt-2',
    );
  });

  test('applies custom className', () => {
    const { container } = render(
      <ModalFooter className='custom-footer'>
        <div>Footer content</div>
      </ModalFooter>,
    );

    const footer = container.querySelector('.ModalFooter');
    expect(footer).toHaveClass('custom-footer');
  });

  test('handles undefined className gracefully', () => {
    const { container } = render(
      <ModalFooter className={undefined}>
        <div>Footer content</div>
      </ModalFooter>,
    );

    const footer = container.querySelector('.ModalFooter');
    expect(footer).toBeInTheDocument();
  });

  test('handles empty children', () => {
    const { container } = render(<ModalFooter>{undefined}</ModalFooter>);

    const footer = container.querySelector('.ModalFooter');
    expect(footer).toBeInTheDocument();
    expect(footer).toBeEmptyDOMElement();
  });

  test('handles complex children', () => {
    render(
      <ModalFooter>
        <div>
          <span>Left content</span>
        </div>
        <div>
          <button>Action 1</button>
          <button>Action 2</button>
        </div>
      </ModalFooter>,
    );

    expect(screen.getByText('Left content')).toBeInTheDocument();
    expect(screen.getByText('Action 1')).toBeInTheDocument();
    expect(screen.getByText('Action 2')).toBeInTheDocument();
  });
});
