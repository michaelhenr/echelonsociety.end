import { render } from '@testing-library/react';
import avatar from '@/components/ui/avatar';

describe('Component: avatar', () => {
  it('renders without crashing', () => {
    render(<avatar />);
  });
});
