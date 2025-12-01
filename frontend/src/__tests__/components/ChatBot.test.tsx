import { render } from '@testing-library/react';
import ChatBot from '@/components/ChatBot';

describe('Component: ChatBot', () => {
  it('renders without crashing', () => {
    render(<ChatBot />);
  });
});
