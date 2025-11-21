import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { IssueCard } from './IssueCard';
import { IssueStatus } from '../../types';
import type { Issue } from '../../types';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock @dnd-kit/sortable
vi.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: undefined,
    isDragging: false,
  }),
}));

const mockIssue: Issue = {
  id: 'ISSUE-001',
  title: 'Test Issue',
  description: 'This is a test issue description',
  status: IssueStatus.BACKLOG,
  tags: ['bug', 'urgent'],
  assignee: 'John Doe',
  severity: 3,
  userDefinedRank: 1,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-02',
};

describe('IssueCard Component', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render issue card with title', () => {
    renderWithRouter(<IssueCard issue={mockIssue} canDrag={true} />);
    expect(screen.getByText('Test Issue')).toBeInTheDocument();
  });

  it('should render all tags', () => {
    renderWithRouter(<IssueCard issue={mockIssue} canDrag={true} />);
    expect(screen.getByText('bug')).toBeInTheDocument();
    expect(screen.getByText('urgent')).toBeInTheDocument();
  });
});
