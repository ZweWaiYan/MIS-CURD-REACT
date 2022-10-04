import * as React from 'react';
import './SearchBox.css';
import PropTypes from 'prop-types';
import { useState } from 'react';

//if data have in runtime
const propTypes = {
    className: PropTypes.string,
    value: PropTypes.string,
    onSearchKeywordChange: PropTypes.func.isRequired
};

//if data havn't in runtime
const defaultProps = {
    className: "",
    value: "",
};

export const SearchBox = (props) => {
    const { value } = props;
    return (
        <div className='input_group'>
            <input
                id="search" name="search" type="text"
                placeholder="Type to search..."
                value={value}
                className="form_control"
                onChange={(e) =>  props.onSearchKeywordChange(e.target.value, true) }
            />
            <div className="input_group-append">
                <button className="btn_ btn_bg btn_tcolor" onClick={() => props.onSearchKeywordChange("", false)}>
                    <i className="fa fa-search"></i>
                </button>
            </div>
        </div>
    )
}

const btn = () => {
    if(value == ""){
        console.log("nothing");
    }
    console.log("has");
}


//if data has not in runtime get props from defaultProps so we don't need to worry about runtime Error 
SearchBox.propTypes = propTypes;
SearchBox.defaultProps = defaultProps;