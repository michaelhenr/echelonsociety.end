import { render } from '@testing-library/react';
import alert from '@/components/ui/alert';

describe('Component: alert', () => {
  it('renders without crashing', () => {
    render(<alert />);
  });
});
