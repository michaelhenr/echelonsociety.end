import { render } from '@testing-library/react';
import checkbox from '@/components/ui/checkbox';

describe('Component: checkbox', () => {
  it('renders without crashing', () => {
    render(<checkbox />);
  });
});
