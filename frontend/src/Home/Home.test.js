import { render, screen, fireEvent } from '@testing-library/react';
import Home from './Home';
import '@testing-library/jest-dom';

test('clicking "Next" button switches to the next slide', async () => {
    const { container } = render(<Home />);

  const nextButton = await container.querySelector('.carousel-control-next-icon');
  fireEvent.click(nextButton);

  const activeSlide = await screen.findByTestId('posts-list-slide');
  expect(activeSlide.closest('.carousel-item')).toHaveClass('active');
});
