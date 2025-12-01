import { render } from '@testing-library/react';
import chart from '@/components/ui/chart';

describe('Component: chart', () => {
  it('renders without crashing', () => {
    render(<chart />);
  });
});
