import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Column } from './Column';
import { IssueStatus } from '../../types';
import type { Issue } from '../../types';

// Mock @dnd-kit/core
vi.mock('@dnd-kit/core', () => ({
  useDroppable: () => ({
    setNodeRef: vi.fn(),
    isOver: false,
  }),
}));

// Mock @dnd-kit/sortable
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

const mockIssue: Issue = {
  id: 'ISSUE-001',
  title: 'First Issue',
  description: 'Description 1',
  status: IssueStatus.BACKLOG,
  tags: ['bug'],
  assignee: 'John Doe',
  severity: 2,
  userDefinedRank: 1,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

describe('Column Component', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render column with title', () => {
    renderWithRouter(
      <Column title="Backlog" status={IssueStatus.BACKLOG} issues={[]} canDrag={true} />
    );
    expect(screen.getByText('Backlog')).toBeInTheDocument();
  });

  it('should display correct issue count', () => {
    renderWithRouter(
      <Column title="Backlog" status={IssueStatus.BACKLOG} issues={[mockIssue]} canDrag={true} />
    );
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should display empty message when no issues', () => {
    renderWithRouter(
      <Column title="Backlog" status={IssueStatus.BACKLOG} issues={[]} canDrag={true} />
    );
    expect(screen.getByText('No issues in this column')).toBeInTheDocument();
  });
});
