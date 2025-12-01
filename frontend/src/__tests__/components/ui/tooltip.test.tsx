import { render } from '@testing-library/react';
import tooltip from '@/components/ui/tooltip';

describe('Component: tooltip', () => {
  it('renders without crashing', () => {
    render(<tooltip />);
  });
});
