import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { Col } from "reactstrap";

const PageTitle = ({ title, subtitle,form, className, ...attrs }) => {
  const classes = classNames(
    className,
    "text-center",
    "text-md-left",
    "mb-sm-0"
  );

  return (
    <Col xs="12" sm="4" className={classes} { ...attrs }>
      <span className="text-uppercase page-subtitle">{subtitle}</span>
      <h3 className="page-title">{title}</h3>
      {form != null? 
        <span className="text-uppercase page-subtitle">{form}</span>:""
      }
    </Col>
  )
};

PageTitle.propTypes = {
  /**
   * The page title.
   */
  title: PropTypes.string,
  /**
   * The page subtitle.
   */
  subtitle: PropTypes.string,
  /**
   * The page subtitle.
   */
  form: PropTypes.string
};

export default PageTitle;
