import { render } from '@testing-library/react';
import toggle from '@/components/ui/toggle';

describe('Component: toggle', () => {
  it('renders without crashing', () => {
    render(<toggle />);
  });
});
