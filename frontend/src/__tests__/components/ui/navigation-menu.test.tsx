import { render } from '@testing-library/react';
import navigation-menu from '@/components/ui/navigation-menu';

describe('Component: navigation-menu', () => {
  it('renders without crashing', () => {
    render(<navigation-menu />);
  });
});
