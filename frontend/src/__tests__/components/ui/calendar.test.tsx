import { render } from '@testing-library/react';
import calendar from '@/components/ui/calendar';

describe('Component: calendar', () => {
  it('renders without crashing', () => {
    render(<calendar />);
  });
});
