import Inferno from 'inferno';
import PropTypes from 'prop-types';

export const Pagination = (props) => {
  PropTypes.checkPropTypes({
    currentPage: PropTypes.number.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    stats: PropTypes.object.isRequired,
    setPage: PropTypes.func.isRequired,
  }, props, 'prop', 'Pagination');

  const { currentPage, itemsPerPage, stats, setPage } = props;

  const totalWords = stats.hasOwnProperty('numberOfWords')
    ? stats.numberOfWords.find(group => group.name === 'Total').value : null;
  
  if (totalWords === null) {
    return <div className="loader"></div>;
  }

  const lastPage = Math.floor(totalWords / itemsPerPage);
  const nextPage = currentPage + 1 > lastPage ? lastPage : currentPage + 1;
  const prevPage = currentPage - 1 < 0 ? 0 : currentPage - 1;

  const changePage = (page) => {
    if (page !== currentPage && page <= lastPage && page >= 0) {
      setPage(page);
    }
  }

  return (
    <nav className="pagination is-centered" role="navigation" aria-label="pagination">
      <a className="pagination-previous" aria-label="Goto page 1"
        Disabled={currentPage === 0 ? 'disabled' : null}
        onClick={() => changePage(prevPage)}>
        Previous
      </a>
      <a className="pagination-next" aria-label={`Goto page ${lastPage + 1}`}
        Disabled={currentPage === lastPage ? 'disabled' : null}
        onClick={() => changePage(nextPage)}>
        Next
      </a>
      <div className="pagination-list">
        <div class="select">
          <select value={currentPage} onChange={(event) => changePage(parseInt(event.target.value))}>
            {[...new Array(lastPage + 1)].map((v, index) => {
              return <option value={index}>{index + 1}</option>;
            })}
          </select>
        </div>
      </div>
    </nav>
  );
}
