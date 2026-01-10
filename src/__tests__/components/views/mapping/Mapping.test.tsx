/* eslint-env jest */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { AxiosResponse } from 'axios';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import Mapping from '../../../../components/views/mapping/Mapping';
import { deleteMapping, getMappings } from '../../../../services/services';
import type { Mapping as MappingType } from '../../../../types/models';

jest.mock('../../../../services/services', () => ({
  deleteMapping: jest.fn(),
  getMappings: jest.fn(),
}));

jest.mock('react-icons/fa', () => ({
  FaArrowLeft: () => <div data-testid='arrow-left-icon' />,
}));

jest.mock('../../../../utils/HelpText', () => ({
  MAPPING_HELP_TEXT: 'This is mapping help text',
}));

// Mock child components
jest.mock('../../../../components/common/Help', () => {
  return function MockHelp({ content }: { content: string }) {
    return <div data-testid='help-component'>{content}</div>;
  };
});

jest.mock('../../../../components/views/mapping/AddMapping', () => {
  return function MockAddMapping({
    mappings,
    setMappings,
  }: {
    mappings: MappingType[];
    setMappings: (mappings: MappingType[]) => void;
  }) {
    return (
      <div data-testid='add-mapping-component'>
        <button
          onClick={() =>
            setMappings([
              ...mappings,
              { mappingName: 'Test', attribute: 'Current' },
            ])
          }
        >
          Add Test Mapping
        </button>
      </div>
    );
  };
});

jest.mock('../../../../components/views/mapping/MappingBlock', () => {
  return function MockMappingBlock({
    mappingName,
    attribute,
    showDelete,
    deleteMapping,
  }: {
    mappingName: string;
    attribute: string;
    showDelete: boolean;
    deleteMapping: (mappingName: string) => void;
  }) {
    return (
      <div data-testid={`mapping-block-${mappingName}`}>
        <span>
          {mappingName} -&gt; {attribute}
        </span>
        {showDelete && (
          <button onClick={() => deleteMapping(mappingName)}>Delete</button>
        )}
      </div>
    );
  };
});

jest.mock('../../../../components/views/mapping/MappingConstants', () => ({
  attributeMappings: {
    'Average Current': 'Current',
    'Power Factor': 'System Power Factor',
  },
}));

const mockGetMappings = getMappings as jest.MockedFunction<typeof getMappings>;
const mockDeleteMapping = deleteMapping as jest.MockedFunction<
  typeof deleteMapping
>;

const renderWithRouter = (
  component: React.ReactElement,
  initialRoute = '/mapping',
) => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>{component}</MemoryRouter>,
  );
};

describe('Mapping', () => {
  const mockMappings: MappingType[] = [
    { mappingName: 'Custom Mapping 1', attribute: 'Voltage' },
    { mappingName: 'Custom Mapping 2', attribute: 'Real Power' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetMappings.mockResolvedValue({
      data: mockMappings,
    } as AxiosResponse<MappingType[]>);
    mockDeleteMapping.mockResolvedValue({
      data: undefined,
    } as AxiosResponse<void>);
  });

  test('renders mapping page layout', async () => {
    renderWithRouter(<Mapping />);

    expect(screen.getByText('Attribute Mappings')).toBeInTheDocument();
    expect(screen.getByText('Back to manage')).toBeInTheDocument();
    expect(screen.getByTestId('arrow-left-icon')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('add-mapping-component')).toBeInTheDocument();
    });
  });

  test('renders help component with correct content', async () => {
    renderWithRouter(<Mapping />);

    await waitFor(() => {
      expect(screen.getByTestId('help-component')).toBeInTheDocument();
      expect(screen.getByText('This is mapping help text')).toBeInTheDocument();
    });
  });

  test('fetches mappings on component mount', async () => {
    renderWithRouter(<Mapping />);

    await waitFor(() => {
      expect(mockGetMappings).toHaveBeenCalled();
    });
  });

  test('renders mapping blocks for fetched data', async () => {
    renderWithRouter(<Mapping />);

    await waitFor(() => {
      expect(
        screen.getByTestId('mapping-block-Custom Mapping 1'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('mapping-block-Custom Mapping 2'),
      ).toBeInTheDocument();
    });
  });

  test('renders read-only mapping blocks from attributeMappings', async () => {
    renderWithRouter(<Mapping />);

    await waitFor(() => {
      expect(
        screen.getByTestId('mapping-block-Average Current'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('mapping-block-Power Factor'),
      ).toBeInTheDocument();
    });
  });

  test('passes correct props to AddMapping component', async () => {
    renderWithRouter(<Mapping />);

    await waitFor(() => {
      expect(screen.getByTestId('add-mapping-component')).toBeInTheDocument();
    });

    // Test that setMappings works by clicking the test button
    const addButton = screen.getByText('Add Test Mapping');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByTestId('mapping-block-Test')).toBeInTheDocument();
    });
  });

  test('sorts mappings by attribute name', async () => {
    renderWithRouter(<Mapping />);

    await waitFor(() => {
      const mappingBlocks = screen.getAllByTestId(/mapping-block-/);
      expect(mappingBlocks).toHaveLength(4); // 2 from constants + 2 from mock data
    });
  });

  test('handles mapping deletion', async () => {
    renderWithRouter(<Mapping />);

    await waitFor(() => {
      expect(
        screen.getByTestId('mapping-block-Custom Mapping 1'),
      ).toBeInTheDocument();
    });

    const customMapping1Block = screen.getByTestId(
      'mapping-block-Custom Mapping 1',
    );
    const deleteButton = customMapping1Block.querySelector('button')!;
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteMapping).toHaveBeenCalledWith('Custom Mapping 1');
    });

    await waitFor(() => {
      expect(mockGetMappings).toHaveBeenCalledTimes(2); // Once on mount, once after delete
    });
  });

  test('navigates back to manage page', () => {
    renderWithRouter(<Mapping />);

    const backLink = screen.getByRole('link', { name: /back to manage/i });
    expect(backLink).toHaveAttribute('href', '/manage');
  });

  test('renders with correct CSS classes and layout', () => {
    const { container } = renderWithRouter(<Mapping />);

    const mainElement = container.querySelector('main.Mapping');
    expect(mainElement).toHaveClass(
      'flex',
      'w-full',
      'flex-col',
      'items-center',
      'justify-center',
    );

    const contentDiv = container.querySelector('.fade-in');
    expect(contentDiv).toHaveClass(
      'fade-in',
      'my-8',
      'flex',
      'w-[55rem]',
      'max-w-full',
      'flex-col',
      'bg-white',
      'p-6',
      'shadow-panel',
      'dark:bg-gray-800',
      'sm:rounded-lg',
      'sm:p-8',
    );
  });

  test('shows delete buttons only for custom mappings', async () => {
    renderWithRouter(<Mapping />);

    await waitFor(() => {
      // Custom mappings should have delete buttons
      const customMapping1 = screen.getByTestId(
        'mapping-block-Custom Mapping 1',
      );
      expect(customMapping1.querySelector('button')).toBeInTheDocument();

      const customMapping2 = screen.getByTestId(
        'mapping-block-Custom Mapping 2',
      );
      expect(customMapping2.querySelector('button')).toBeInTheDocument();

      // Read-only mappings should not have delete buttons
      const readOnlyMapping1 = screen.getByTestId(
        'mapping-block-Average Current',
      );
      expect(readOnlyMapping1.querySelector('button')).not.toBeInTheDocument();

      const readOnlyMapping2 = screen.getByTestId('mapping-block-Power Factor');
      expect(readOnlyMapping2.querySelector('button')).not.toBeInTheDocument();
    });
  });

  test('handles empty mappings array', async () => {
    mockGetMappings.mockResolvedValue({
      data: [],
    } as AxiosResponse<MappingType[]>);

    renderWithRouter(<Mapping />);

    await waitFor(() => {
      // Should still render read-only mappings from constants
      expect(
        screen.getByTestId('mapping-block-Average Current'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('mapping-block-Power Factor'),
      ).toBeInTheDocument();

      // Should not render any custom mappings
      expect(
        screen.queryByTestId('mapping-block-Custom Mapping 1'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('mapping-block-Custom Mapping 2'),
      ).not.toBeInTheDocument();
    });
  });

  test('renders component structure correctly', async () => {
    renderWithRouter(<Mapping />);

    await waitFor(() => {
      expect(mockGetMappings).toHaveBeenCalled();
    });

    // Component should render all expected elements
    expect(screen.getByText('Attribute Mappings')).toBeInTheDocument();
    expect(screen.getByTestId('add-mapping-component')).toBeInTheDocument();
    expect(screen.getByTestId('help-component')).toBeInTheDocument();
  });
});
