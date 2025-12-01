import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SubmitProduct from '@/pages/SubmitProduct';

describe('SubmitProduct page', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><SubmitProduct /></MemoryRouter>);
  });
});
