import { render } from '@testing-library/react';
import drawer from '@/components/ui/drawer';

describe('Component: drawer', () => {
  it('renders without crashing', () => {
    render(<drawer />);
  });
});
