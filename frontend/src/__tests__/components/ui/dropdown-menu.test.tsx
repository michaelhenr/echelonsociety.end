import { render } from '@testing-library/react';
import dropdown-menu from '@/components/ui/dropdown-menu';

describe('Component: dropdown-menu', () => {
  it('renders without crashing', () => {
    render(<dropdown-menu />);
  });
});
