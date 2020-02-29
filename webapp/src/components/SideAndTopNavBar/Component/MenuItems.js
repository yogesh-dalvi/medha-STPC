import React from "react";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import EmojiFlagsOutlinedIcon from "@material-ui/icons/EmojiFlagsOutlined";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import PeopleOutlineOutlinedIcon from "@material-ui/icons/PeopleOutlineOutlined";
import AssignmentIndOutlinedIcon from "@material-ui/icons/AssignmentIndOutlined";
import * as routeConstants from "../../../constants/RouteConstants";

const MenuItems = props => {
  const menuItems = {
    Admin: [
      {
        name: "Training",
        Icon: <AssignmentOutlinedIcon />,
        items: [
          {
            name: "Manage Training",
            link: ""
          },
          {
            name: "Validate Student",
            link: ""
          }
        ]
      },
      {
        name: "Events",
        link: "",
        Icon: <EmojiFlagsOutlinedIcon />
      },
      {
        name: "Profile",
        link: routeConstants.DASHBOARD_URL,
        Icon: <PersonOutlineOutlinedIcon />
      },
      {
        name: "User Management",
        link: routeConstants.ADD_USER,
        Icon: <PeopleOutlineOutlinedIcon />
      },
      {
        name: "Masters",
        Icon: <AssignmentIndOutlinedIcon />,
        items: [
          {
            name: "State",
            link: routeConstants.VIEW_STATES
          },
          {
            name: "Zone",
            link: routeConstants.VIEW_ZONES
          },
          {
            name: "RPC",
            link: routeConstants.VIEW_RPC
          },
          {
            name: "College",
            link: routeConstants.VIEW_COLLEGE
          }
        ]
      }
    ],
    CollegeAdmin: [
      {
        name: "College",
        link: "",
        Icon: ""
      },
      {
        name: "Students",
        Icon: "",
        items: [
          {
            name: "Manage Students",
            link: ""
          },
          {
            name: "Import Students",
            link: ""
          }
        ]
      },
      {
        name: "Training",
        Icon: "",
        items: [
          {
            name: "Manage Students Group",
            link: ""
          },
          {
            name: "Validate Student",
            link: ""
          }
        ]
      },
      {
        name: "Events",
        Icon: ""
      }
    ],
    Student: [
      {
        name: "Training",
        link: ""
      },
      {
        name: "Events",
        link: ""
      },
      {
        name: "Profile",
        link: ""
      }
    ]
  };

  return menuItems;
};

export default MenuItems;
