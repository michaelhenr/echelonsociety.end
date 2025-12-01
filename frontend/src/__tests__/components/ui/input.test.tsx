import { render } from '@testing-library/react';
import input from '@/components/ui/input';

describe('Component: input', () => {
  it('renders without crashing', () => {
    render(<input />);
  });
});
