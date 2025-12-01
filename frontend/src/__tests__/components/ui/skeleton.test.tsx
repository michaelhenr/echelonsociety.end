import { render } from '@testing-library/react';
import skeleton from '@/components/ui/skeleton';

describe('Component: skeleton', () => {
  it('renders without crashing', () => {
    render(<skeleton />);
  });
});
