import React from "react";
import PropTypes from "prop-types";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Icon from "@material-ui/core/Icon";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CardBody from "components/Card/CardBody.jsx";
import moment from 'moment';

import CallendarGrid from "components/CallendarGrid/CallendarGrid.jsx"



import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

class Dashboard extends React.Component {
  state = {
    value: 0
  };
  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Card plain>
          <CardHeader plain color="primary">
            <h4 className={classes.cardTitleWhite}>Alert Dashboard</h4>
            <p className={classes.cardCategoryWhite}>
              Maintaining by Lanka Software Foundation. 
            </p>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
              <CallendarGrid></CallendarGrid>
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>

        <Card plain>
          <CardHeader plain color="primary">
            <h4 className={classes.cardTitleWhite}>Last Day Updates</h4>
            <p className={classes.cardCategoryWhite}>
            {moment().toString() }
            </p>
          </CardHeader>
          <CardBody>
          <GridContainer>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                  <Icon>content_copy</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Live instances</p>
                <h3 className={classes.cardTitle}>
                  5
                </h3>
              </CardHeader>
              <CardFooter stats>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="warning" stats icon>
                <CardIcon color="warning">
                <Icon>warning</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Warnings</p>
                <h3 className={classes.cardTitle}>10</h3>
              </CardHeader>
              <CardFooter stats>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="danger" stats icon>
                <CardIcon color="danger">
                  <Icon>info_outline</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Issues</p>
                <h3 className={classes.cardTitle}>0</h3>
              </CardHeader>
              <CardFooter stats>
              </CardFooter>
            </Card>
          </GridItem>
          
        </GridContainer>
          </CardBody>
        </Card>

        
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
