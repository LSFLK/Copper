import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import tableStyle from "assets/jss/material-dashboard-react/components/tableStyle.jsx";
import CalendarHeatmap from 'reactjs-calendar-heatmap';
import moment from 'moment';
import * as d3 from 'd3';


class callendarGrid extends React.Component {

  constructor(props) {
    super(props)

    // Initialize random data for the demo
    let now = moment().endOf('day').toDate()
    let time_ago = moment().startOf('day').subtract(10, 'year').toDate()
    let data = d3.timeDays(time_ago, now).map(function (dateElement, index) {
      return {
        date: dateElement,
        details: Array.apply(null, new Array(Math.floor(Math.random() * 15))).map(function(e, i, arr) {
          return {
            'name': 'Inst.  ' + Math.ceil(Math.random() * 5),
            'date': function () {
              let projectDate = new Date(dateElement.getTime())
              projectDate.setHours(Math.floor(Math.random() * 24))
              projectDate.setMinutes(Math.floor(Math.random() * 60))
              return projectDate
            }(),
            'value': 360 * ((arr.length - i) / 5) + Math.floor(Math.random() * 360) * Math.round(Math.random() * (index / 365))
          }
        }),
        init: function () {
          this.total = this.details.reduce(function (prev, e) {
            return prev + e.value
          }, 0)
          return this
        }
      }.init()
    })

    this.state = {
      data: data,
      color: '#cd2327',
      overview: 'day',
    }
  }

  print(val) {
    console.log(val)
  }

  render() {
    return (
      <CalendarHeatmap
        data={this.state.data}
        color={this.state.color}
        overview={this.state.overview}
        handler={this.print.bind(this)}>
      </CalendarHeatmap>
    )
  }
}


export default withStyles(tableStyle)(callendarGrid);
