import { render } from '@testing-library/react';
import button from '@/components/ui/button';

describe('Component: button', () => {
  it('renders without crashing', () => {
    render(<button />);
  });
});
