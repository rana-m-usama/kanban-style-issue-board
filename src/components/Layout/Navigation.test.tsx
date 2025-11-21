import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Navigation } from './Navigation';

// Mock the current user
vi.mock('../../constants/currentUser', () => ({
  currentUser: {
    name: 'Test User',
    role: 'admin',
  },
}));

describe('Navigation Component', () => {
  const renderWithRouter = (component: React.ReactElement, initialEntries = ['/']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        {component}
      </MemoryRouter>
    );
  };

  it('should render navigation bar', () => {
    renderWithRouter(<Navigation />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should render brand link', () => {
    renderWithRouter(<Navigation />);
    expect(screen.getByText('Kanban Issue Board')).toBeInTheDocument();
  });

  it('should render current user name', () => {
    renderWithRouter(<Navigation />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });
});
