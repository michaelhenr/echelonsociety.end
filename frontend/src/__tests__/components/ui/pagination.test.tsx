import { render } from '@testing-library/react';
import pagination from '@/components/ui/pagination';

describe('Component: pagination', () => {
  it('renders without crashing', () => {
    render(<pagination />);
  });
});
