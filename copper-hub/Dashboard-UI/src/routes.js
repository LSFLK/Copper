// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.jsx";
// core components/views for RTL layout

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Copper-Hub",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin"
  }
];

export default dashboardRoutes;
