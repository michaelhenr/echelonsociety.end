import { render } from '@testing-library/react';
import separator from '@/components/ui/separator';

describe('Component: separator', () => {
  it('renders without crashing', () => {
    render(<separator />);
  });
});
