import { render } from '@testing-library/react';
import slider from '@/components/ui/slider';

describe('Component: slider', () => {
  it('renders without crashing', () => {
    render(<slider />);
  });
});
