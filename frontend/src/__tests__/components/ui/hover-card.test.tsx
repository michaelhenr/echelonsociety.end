import { render } from '@testing-library/react';
import hover-card from '@/components/ui/hover-card';

describe('Component: hover-card', () => {
  it('renders without crashing', () => {
    render(<hover-card />);
  });
});
