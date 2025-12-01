import { render } from '@testing-library/react';
import carousel from '@/components/ui/carousel';

describe('Component: carousel', () => {
  it('renders without crashing', () => {
    render(<carousel />);
  });
});
