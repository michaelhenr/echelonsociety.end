import { render } from '@testing-library/react';
import sidebar from '@/components/ui/sidebar';

describe('Component: sidebar', () => {
  it('renders without crashing', () => {
    render(<sidebar />);
  });
});
