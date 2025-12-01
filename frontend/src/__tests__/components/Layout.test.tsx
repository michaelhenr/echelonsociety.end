import { render } from '@testing-library/react';
import Layout from '@/components/Layout';

describe('Component: Layout', () => {
  it('renders without crashing', () => {
    render(<Layout />);
  });
});
