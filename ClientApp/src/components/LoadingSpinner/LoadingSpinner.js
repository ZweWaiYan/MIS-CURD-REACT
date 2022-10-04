import * as React from 'react';
import PropTypes from 'prop-types';
import './LoadingSpinner.css';

const propTypes = {
  className: PropTypes.string,
  snapToParent: PropTypes.bool,
  disableIEFix: PropTypes.bool,
};

const defaultProps = {
  snapToParent: false,
  disableIEFix: false,
  className: "",
};

export const LoadingSpinner = (props) => {
  const {
    className,
    snapToParent,
    disableIEFix
  } = props;

  let cN = disableIEFix ? "loadingNoFix" : "loading";
  if (snapToParent) {
    cN += " " + "snapToParent";
  }
  cN += " "+className;
  return <div className={cN}>Processing...</div >
}

LoadingSpinner.propTypes = propTypes;
LoadingSpinner.defaultProps = defaultProps;