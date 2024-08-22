import './SearchBar.css';

const SearchBar = ({ names, values, onChange, placeholders, handleSubmit, component }) => {
	return (
		<div className='search-form' id={component}>
			<form onSubmit={handleSubmit} className='bg-light p-3 rounded shadow-md'>
				{names.map((name, i) => (
					<div key={i} className="mx-2">
						<input className='form-control' id={name} name={name} type='text' placeholder={placeholders[i]} value={values[i] || ''} onChange={onChange} />
					</div>
				))}
				<button className='btn btn-primary mx-2'>Search</button>
			</form>
		</div>
	);
};

export default SearchBar;