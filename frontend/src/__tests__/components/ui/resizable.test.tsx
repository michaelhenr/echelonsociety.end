import { render } from '@testing-library/react';
import resizable from '@/components/ui/resizable';

describe('Component: resizable', () => {
  it('renders without crashing', () => {
    render(<resizable />);
  });
});
