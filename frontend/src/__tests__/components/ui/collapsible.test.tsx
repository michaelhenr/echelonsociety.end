import { render } from '@testing-library/react';
import collapsible from '@/components/ui/collapsible';

describe('Component: collapsible', () => {
  it('renders without crashing', () => {
    render(<collapsible />);
  });
});
