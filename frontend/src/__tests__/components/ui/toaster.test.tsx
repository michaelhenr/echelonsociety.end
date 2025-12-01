import { render } from '@testing-library/react';
import toaster from '@/components/ui/toaster';

describe('Component: toaster', () => {
  it('renders without crashing', () => {
    render(<toaster />);
  });
});
