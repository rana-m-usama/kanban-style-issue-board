import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast } from './Toast';
import { useToastStore } from '../../../store/toastStore';

describe('Toast Component', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
  });

  it('should not render anything when there are no toasts', () => {
    const { container } = render(<Toast />);
    expect(container.firstChild).toBeNull();
  });

  it('should render toast with message', () => {
    useToastStore.getState().addToast('Test message', 'success');
    render(<Toast />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should render undo button when onUndo is provided', () => {
    const onUndo = vi.fn();
    useToastStore.getState().addToast('Action completed', 'success', onUndo);
    render(<Toast />);
    
    expect(screen.getByText('Undo')).toBeInTheDocument();
  });
});
