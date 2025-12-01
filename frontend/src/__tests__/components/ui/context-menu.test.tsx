import { render } from '@testing-library/react';
import context-menu from '@/components/ui/context-menu';

describe('Component: context-menu', () => {
  it('renders without crashing', () => {
    render(<context-menu />);
  });
});
