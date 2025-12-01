import { render } from '@testing-library/react';
import toggle-group from '@/components/ui/toggle-group';

describe('Component: toggle-group', () => {
  it('renders without crashing', () => {
    render(<toggle-group />);
  });
});
