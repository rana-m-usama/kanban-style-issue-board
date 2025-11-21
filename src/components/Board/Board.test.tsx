import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Board } from './Board';
import { useIssueStore } from '../../store/issueStore';
import { IssueStatus } from '../../types';
import type { Issue } from '../../types';

// Mock stores
vi.mock('../../store/issueStore');
vi.mock('../../store/toastStore', () => ({
  useToastStore: () => ({
    toasts: [],
    addToast: vi.fn(),
    removeToast: vi.fn(),
  }),
}));

// Mock hooks
vi.mock('../../hooks/usePolling', () => ({
  usePolling: vi.fn(),
}));

// Mock permissions
vi.mock('../../utils/permissions', () => ({
  canMoveIssues: () => true,
}));

// Mock @dnd-kit
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DragOverlay: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useSensor: vi.fn(),
  useSensors: vi.fn(() => []),
  PointerSensor: vi.fn(),
  useDroppable: () => ({
    setNodeRef: vi.fn(),
    isOver: false,
  }),
}));

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  verticalListSortingStrategy: {},
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: undefined,
    isDragging: false,
  }),
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

const mockIssues: Issue[] = [
  {
    id: 'ISSUE-001',
    title: 'Test Issue 1',
    description: 'Description 1',
    status: IssueStatus.BACKLOG,
    tags: ['bug'],
    assignee: 'John Doe',
    severity: 2,
    userDefinedRank: 1,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

describe('Board Component', () => {
  const mockFetchIssues = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    (useIssueStore as any).mockReturnValue({
      issues: mockIssues,
      filteredIssues: mockIssues,
      filters: {
        searchQuery: '',
        assignee: null,
        severity: null,
      },
      fetchIssues: mockFetchIssues,
      updateIssue: vi.fn(),
      updateIssueOptimistic: vi.fn(),
      revertIssue: vi.fn(),
      setFilters: vi.fn(),
      lastSyncTime: null,
    });
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render board title', () => {
    renderWithRouter(<Board />);
    expect(screen.getByText('Issue Board')).toBeInTheDocument();
  });

  it('should render all three columns', () => {
    renderWithRouter(<Board />);
    expect(screen.getByText('Backlog')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('should render search input', () => {
    renderWithRouter(<Board />);
    expect(screen.getByPlaceholderText('Search by title or tags...')).toBeInTheDocument();
  });
});
