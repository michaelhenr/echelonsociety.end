import { render } from '@testing-library/react';
import accordion from '@/components/ui/accordion';

describe('Component: accordion', () => {
  it('renders without crashing', () => {
    render(<accordion />);
  });
});
