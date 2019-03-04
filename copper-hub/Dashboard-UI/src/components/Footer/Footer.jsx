import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import footerStyle from "assets/jss/material-dashboard-react/components/footerStyle.jsx";

function Footer({ ...props }) {
  const { classes } = props;
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <p className={classes.right}>
          <span>
            &copy; {1900 + new Date().getYear()}{" "}
            
              Lanka Software Foundation
            
          </span>
        </p>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(footerStyle)(Footer);
