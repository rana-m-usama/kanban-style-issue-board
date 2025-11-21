import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

describe('Select Component', () => {
  it('should render select without label', () => {
    render(<Select options={mockOptions} />);
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('should call onChange when option is selected', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Select options={mockOptions} onChange={handleChange} />);
    
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'option2');
    
    expect(handleChange).toHaveBeenCalled();
  });
});
