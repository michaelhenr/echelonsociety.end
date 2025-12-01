import { render } from '@testing-library/react';
import menubar from '@/components/ui/menubar';

describe('Component: menubar', () => {
  it('renders without crashing', () => {
    render(<menubar />);
  });
});
