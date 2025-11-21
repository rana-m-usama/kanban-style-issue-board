import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input Component', () => {
  it('should render input without label', () => {
    render(<Input value="" onChange={() => {}} />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('should call onChange when user types', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input value="" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'Hello');
    
    expect(handleChange).toHaveBeenCalled();
  });
});
