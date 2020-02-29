import React, { useState, useEffect } from "react";

import {
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Typography
} from "@material-ui/core";

import * as strapiConstants from "../../constants/StrapiApiConstants";
import { Table, Spinner } from "../../components";
import Autocomplete from "@material-ui/lab/Autocomplete";
import styles from "./Zone.module.css";
import useStyles from "./ZoneStyles";
import * as serviceProviders from "../../api/Axios";
import * as formUtilities from "../../Utilities/FormUtilities";
import EditZone from "./EditZone";

const ZONES_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ZONES;
const STATES_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STATES;

const ViewZone = props => {
  const [formState, setFormState] = useState({
    data: [],
    viewzones: [],
    getstates: [],
    filterData: {},
    dataToEdit: {},
    cellId: "",
    isEdit: false,
    isDelete: false,
    showModal: false,
    initializeModal: false
  });

  useEffect(() => {
    getZoneData();
    serviceProviders
      .serviceProviderForGetRequest(STATES_URL)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          getstates: res.data
        }));
      })
      .catch(error => {
        console.log("error");
      });
  }, []);

  const getZoneData = () => {
    let params = {};
    if (!formUtilities.checkEmpty(formState.filterData)) {
      params = { id: formState.filterData["id"] };
    }
    serviceProviders
      .serviceProviderForGetRequest(ZONES_URL, params)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          viewzones: res.data
        }));
      })
      .catch(error => {
        console.log("error", error);
      });
  };

  const restoreData = () => {
    serviceProviders
      .serviceProviderForGetRequest(ZONES_URL)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          viewzones: res.data
        }));
      })
      .catch(error => {
        console.log("error");
      });
  };

  const getDataForEdit = async id => {
    let params = { id: id };
    await serviceProviders
      .serviceProviderForGetRequest(ZONES_URL, params)
      .then(res => {
        console.log("res.data ", res.data, id);
        setFormState(formState => ({
          ...formState,
          dataToEdit: res.data[0],
          showModal: true
        }));
      })
      .catch(error => {
        console.log("error");
      });
  };

  const editCell = event => {
    getDataForEdit(event.target.id);
  };

  const deleteCell = event => {
    console.log("Delete ", event.target.id);
  };

  const handleChange = (event, value) => {
    formState.filterData = value;
  };

  const searchFilter = () => {
    formState.data = [];
    formState.viewzones = [];
    getZoneData();
  };

  const clearFilter = () => {
    formState.filterData = {};
    formState.data = [];
    formState.viewzones = [];
    restoreData();
  };

  const handleCloseModal = () => {
    setFormState(formState => ({
      ...formState,
      showModal: false,
      initializeModal: false,
      filterData: {}
    }));
  };

  const column = [
    { name: "Id", sortable: true, selector: "id" },
    { name: "Zone", sortable: true, selector: "name" },
    { name: "States", sortable: true, selector: "state" },
    /** Columns for edit and delete */
    {
      cell: cell => (
        <i
          className="material-icons"
          id={cell.id}
          value={cell.name}
          onClick={editCell}
        >
          edit
        </i>
      ),
      button: true,
      conditionalCellStyles: []
    },
    {
      cell: cell => (
        <i className="material-icons" id={cell.id} onClick={deleteCell}>
          delete_outline
        </i>
      ),
      button: true,
      conditionalCellStyles: []
    }
  ];

  /** Initialize the data to sent */
  formState.data = [];

  /** Set zone data to data in formState */
  if (formState.viewzones.length > 0) {
    for (let i in formState.viewzones) {
      var temp = {};
      temp["id"] = formState.viewzones[i]["id"];
      temp["name"] = formState.viewzones[i]["name"];
      temp["state"] = formState.viewzones[i]["state"]["name"];
      formState.data.push(temp);
    }
  }

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item>
          <Typography variant="h1" className={styles.header}>
            Manage Zone
          </Typography>
        </Grid>
        <Card className={styles.filterButton}>
          <CardContent>
            <Grid className={classes.filterOptions} container spacing={1}>
              <Grid item>
                <Autocomplete
                  id="combo-box-demo"
                  options={formState.data}
                  getOptionLabel={option => option.name}
                  onChange={handleChange}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Zone Name"
                      variant="outlined"
                      style={{ width: "auto" }}
                    />
                  )}
                />
              </Grid>
              <Grid item className={classes.filterButtonsMargin}>
                <Button
                  variant="contained"
                  color="primary"
                  disableElevation
                  onClick={searchFilter}
                >
                  Search
                </Button>
              </Grid>
              <Grid item className={classes.filterButtonsMargin}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={clearFilter}
                  disableElevation
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {formState.data.length ? (
          <Table
            filterData={true}
            filterBy={["state", "name"]}
            data={formState.data}
            column={column}
            editEvent={editCell}
            deleteEvent={deleteCell}
          />
        ) : (
          <Spinner />
        )}
        <EditZone
          states={formState.getstates}
          showModal={formState.showModal}
          closeModal={handleCloseModal}
          dataToEdit={formState.dataToEdit}
          initializeModal={formState.initializeModal}
        />
      </Grid>
    </div>
  );
};

export default ViewZone;
