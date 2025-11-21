import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge Component', () => {
  it('should render badge with children text', () => {
    render(<Badge variant="primary">Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('should render with numeric content', () => {
    render(<Badge variant="primary">42</Badge>);
    expect(screen.getByText('42')).toBeInTheDocument();
  });
});
