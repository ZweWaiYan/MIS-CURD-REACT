import * as React from 'react';
import PropTypes from 'prop-types';
import './Pagination.css';

//if data have in runtime
const propTypes = {
  className: PropTypes.string,
  totalPage: PropTypes.number,
  currentPage: PropTypes.number,
  rowPerPage: PropTypes.number,
  totalRecord: PropTypes.number,
  besideRangeDisplayed: PropTypes.number,
  onClickPageNumber: PropTypes.func.isRequired,
  onClickRowPerPage: PropTypes.func.isRequired
};

//if data havn't in runtime
const defaultProps = {
  className: "",
  totalPage: 0,
  currentPage: 1,
  rowPerPage: 10,
  totalRecord: 0,
  besideRangeDisplayed: 5,
};

export const Pagination = (props) => {
  // console.log("Pagination.js");
  // console.log(props);
  const { className, totalPage, currentPage, rowPerPage, totalRecord, onClickPageNumber, onClickRowPerPage, besideRangeDisplayed } = props;
  return(
    // ""
    <div className={`${className} row_`}>
      <div className="col_xl-5 col_md-10">
        {/* 12 */}
        <strong>Total Record: {totalRecord}</strong>
      </div>
      <div className="col_xl-5 col_md-6" >
        <div className="pag">
          <button href="#" disabled={currentPage <= 1} onClick={e => onClickPageNumber(e, 1)} >First</button>
          <button href="#" disabled={currentPage <= 1} onClick={e => onClickPageNumber(e, currentPage <= 1 ? currentPage : currentPage-1)} >&laquo;</button>
          {/* 2 */}
          {[...Array(totalPage)].map((page, i) => {
            // 2 >= 2 - 2 && 2 <= 2 + 2
            // 2 >= 0 && 2 <= 4
            if(i+1 >= currentPage - besideRangeDisplayed && i+1 <= currentPage + besideRangeDisplayed )
            return(
              // 2 === 1 ? "active" : ""
              <button href="#" className={i+1 === currentPage ? "active":""} key={i+1} 
              onClick={e => onClickPageNumber(e, i+1)}>{i+1}</button>
            );
          })}
          {/* 1 >= 2 */}
          <button href="#" disabled={currentPage >= totalPage} onClick={e => onClickPageNumber(e, currentPage >= totalPage ? currentPage : currentPage+1)} >&raquo;</button>
          <button href="#" disabled={currentPage >= totalPage} onClick={e => onClickPageNumber(e, totalPage)} >Last</button>
        </div>
      </div>
      <div >
        <select className="form_control" type="select" name="rowPerPage" id="rowPerPage" value={rowPerPage} onChange={(e)=>onClickRowPerPage(e)} >
          <option value="5">5 rows</option>
          <option value="10">10 rows</option>
          <option value="20">20 rows</option>
          <option value="25">25 rows</option>
          <option value="50">50 rows</option>
          <option value="100">100 rows</option>
        </select>
      </div>
    </div>
  );
}

//if data has not in runtime get props from defaultProps so we don't need to worry about runtime Error 
Pagination.propTypes = propTypes;
Pagination.defaultProps = defaultProps;