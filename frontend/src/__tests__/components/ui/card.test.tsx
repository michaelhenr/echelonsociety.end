import { render } from '@testing-library/react';
import card from '@/components/ui/card';

describe('Component: card', () => {
  it('renders without crashing', () => {
    render(<card />);
  });
});
