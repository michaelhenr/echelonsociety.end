import { render } from '@testing-library/react';
import badge from '@/components/ui/badge';

describe('Component: badge', () => {
  it('renders without crashing', () => {
    render(<badge />);
  });
});
