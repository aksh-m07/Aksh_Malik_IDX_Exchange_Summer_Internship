import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from './Pagination';

test('renders nothing when there is only one page',()=>{
    const { container } = render(
    <Pagination currentPage={1} totalPages={1} onPageChange={jest.fn()} />
  );
  expect(container).toBeEmptyDOMElement();
})

test('disables the Previous button on page 1',()=>{
    render(<Pagination currentPage={1} totalPages={24} onPageChange={jest.fn()} />)
    expect(screen.getByLabelText('Previous page')).toBeDisabled();

})
test('disables the Next button on the last page', () => {
  render(
    <Pagination currentPage={24} totalPages={24} onPageChange={jest.fn()} />
  );

  expect(screen.getByLabelText('Next page')).toBeDisabled();
});
test('enables the Previous button when not on page 1', () => {
  render(
    <Pagination currentPage={5} totalPages={24} onPageChange={jest.fn()} />
  );

  expect(screen.getByLabelText('Previous page')).not.toBeDisabled();
});
test('enables the Next button when not on the last page', () => {
  render(
    <Pagination currentPage={5} totalPages={24} onPageChange={jest.fn()} />
  );

  expect(screen.getByLabelText('Next page')).not.toBeDisabled();
});
test('calls onPageChange with the previous page number when Previous is clicked', async()=>{
    const mockOnPageChange = jest.fn();
    const user=userEvent.setup();
    render(
        <Pagination currentPage={5} totalPages={24} onPageChange={mockOnPageChange} />
    );
    await user.click(screen.getByLabelText('Previous page'));
    expect(mockOnPageChange).toHaveBeenCalledWith(4);



})

test('calls onPageChange with the next page number when Previous is clicked', async()=>{
    const mockOnPageChange = jest.fn();
    const user=userEvent.setup();
    render(
        <Pagination currentPage={5} totalPages={24} onPageChange={mockOnPageChange} />
    );
    await user.click(screen.getByLabelText('Next page'));
    expect(mockOnPageChange).toHaveBeenCalledWith(6);

})
test('calls onPageChange with the clicked page number', async () => {
  const mockOnPageChange = jest.fn();
  const user = userEvent.setup();

  render(
    <Pagination currentPage={11} totalPages={24} onPageChange={mockOnPageChange} />
  );

  await user.click(screen.getByText('12'));

  expect(mockOnPageChange).toHaveBeenCalledWith(12);
});
test('marks the current page button as active', () => {
  render(
    <Pagination currentPage={5} totalPages={24} onPageChange={jest.fn()} />
  );

  expect(screen.getByText('5')).toHaveClass('active');
});
test('renders ellipsis on both sides for a page in the middle of a large range', () => {
  render(
    <Pagination currentPage={5} totalPages={24} onPageChange={jest.fn()} />
  );

  expect(screen.getAllByText('...')).toHaveLength(2);
  expect(screen.getByText('1')).toBeInTheDocument();
  expect(screen.getByText('4')).toBeInTheDocument();
  expect(screen.getByText('5')).toBeInTheDocument();
  expect(screen.getByText('6')).toBeInTheDocument();
  expect(screen.getByText('24')).toBeInTheDocument();
});