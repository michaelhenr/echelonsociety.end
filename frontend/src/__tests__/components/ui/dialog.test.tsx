import { render } from '@testing-library/react';
import dialog from '@/components/ui/dialog';

describe('Component: dialog', () => {
  it('renders without crashing', () => {
    render(<dialog />);
  });
});
