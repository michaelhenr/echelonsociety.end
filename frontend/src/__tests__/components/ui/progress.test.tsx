import { render } from '@testing-library/react';
import progress from '@/components/ui/progress';

describe('Component: progress', () => {
  it('renders without crashing', () => {
    render(<progress />);
  });
});
