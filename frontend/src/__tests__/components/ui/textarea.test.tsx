import { render } from '@testing-library/react';
import textarea from '@/components/ui/textarea';

describe('Component: textarea', () => {
  it('renders without crashing', () => {
    render(<textarea />);
  });
});
