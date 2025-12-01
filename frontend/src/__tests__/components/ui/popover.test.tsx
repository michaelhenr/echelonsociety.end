import { render } from '@testing-library/react';
import popover from '@/components/ui/popover';

describe('Component: popover', () => {
  it('renders without crashing', () => {
    render(<popover />);
  });
});
