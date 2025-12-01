import { render } from '@testing-library/react';
import form from '@/components/ui/form';

describe('Component: form', () => {
  it('renders without crashing', () => {
    render(<form />);
  });
});
