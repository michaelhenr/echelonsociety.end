import { render } from '@testing-library/react';
import scroll-area from '@/components/ui/scroll-area';

describe('Component: scroll-area', () => {
  it('renders without crashing', () => {
    render(<scroll-area />);
  });
});
