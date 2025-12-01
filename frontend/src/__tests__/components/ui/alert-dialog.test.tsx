import { render } from '@testing-library/react';
import alert-dialog from '@/components/ui/alert-dialog';

describe('Component: alert-dialog', () => {
  it('renders without crashing', () => {
    render(<alert-dialog />);
  });
});
