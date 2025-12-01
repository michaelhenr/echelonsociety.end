import { render } from '@testing-library/react';
import breadcrumb from '@/components/ui/breadcrumb';

describe('Component: breadcrumb', () => {
  it('renders without crashing', () => {
    render(<breadcrumb />);
  });
});
