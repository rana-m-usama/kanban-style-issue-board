import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Layout } from './Layout';
import { useToastStore } from '../../store/toastStore';

// Mock the currentUser
vi.mock('../../constants/currentUser', () => ({
  currentUser: {
    name: 'Test User',
    role: 'admin',
  },
}));

// Mock the toast store
vi.mock('../../store/toastStore');

describe('Layout Component', () => {
  beforeEach(() => {
    (useToastStore as any).mockReturnValue({
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
    });
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  it('should render Navigation component', () => {
    renderWithRouter(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should render children content', () => {
    renderWithRouter(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should have main content area', () => {
    const { container } = renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>
    );
    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
  });
});
