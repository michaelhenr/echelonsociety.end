import { render } from '@testing-library/react';
import tabs from '@/components/ui/tabs';

describe('Component: tabs', () => {
  it('renders without crashing', () => {
    render(<tabs />);
  });
});
