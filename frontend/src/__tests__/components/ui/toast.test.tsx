import { render } from '@testing-library/react';
import toast from '@/components/ui/toast';

describe('Component: toast', () => {
  it('renders without crashing', () => {
    render(<toast />);
  });
});
