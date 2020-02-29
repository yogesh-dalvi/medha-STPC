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
import { Spinner } from "../../components";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Autocomplete from "@material-ui/lab/Autocomplete";
import styles from "./Zone.module.css";
import useStyles from "./ZoneStyles";
import * as serviceProviders from "../../api/Axios";
import * as formUtilities from "../../Utilities/FormUtilities";
import * as genericConstants from "../../constants/GenericConstants";
import Paper from "@material-ui/core/Paper";
import ZoneSchema from "./ZoneSchema";
import { get } from "lodash";

const ZONES_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ZONES;
const ZONE_SCHEMA_NAME = "zoneName";
const STATE_SCEHMA_NAME = "stateName";
var filteredObj = -1;

const EditZone = props => {
  const [formState, setFormState] = useState({
    getstates: [],
    filterData: {},
    values: {},
    errors: {},
    isValid: false,
    stateCounter: 0
  });

  if (props.showModal && !formState.stateCounter) {
    formState.stateCounter = 0;
    formState.values[ZONE_SCHEMA_NAME] = props.dataToEdit["name"];
    formState.values[STATE_SCEHMA_NAME] = props.dataToEdit["state"]["id"];
    formState.getstates = props.states;
    console.log("initialized ", formState, props.dataToEdit);
  }

  const handleCloseModal = () => {
    console.log("hetre");
    formState.isValid = false;
    formState.getstates = [];
    formState.stateCounter = 0;
    formState.filterData = {};
    formState.values = {};
    formState.errors = {};
    console.log(formState);
    props.closeModal();
  };

  const handleChange = event => {
    event.persist();
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value
      },
      stateCounter: formState.stateCounter + 1
    }));
    if (formState.errors.hasOwnProperty(event.target.name)) {
      delete formState.errors[event.target.name];
    }
  };

  const handleSubmit = event => {
    let isValid = false;
    let checkAllFieldsValid = formUtilities.checkAllKeysPresent(
      formState.values,
      ZoneSchema
    );
    if (checkAllFieldsValid) {
      /** Evaluated only if all keys are valid inside formstate */
      formState.errors = formUtilities.setErrors(formState.values, ZoneSchema);
      if (formUtilities.checkEmpty(formState.errors)) {
        isValid = true;
      }
    } else {
      /** This is used to find out which all required fields are not filled */
      formState.values = formUtilities.getListOfKeysNotPresent(
        formState.values,
        ZoneSchema
      );
      formState.errors = formUtilities.setErrors(formState.values, ZoneSchema);
    }
    if (isValid) {
      /** CALL POST FUNCTION */
      console.log("formValid", formState.values);
      setFormState(formState => ({
        ...formState,
        isValid: true
      }));
    } else {
      console.log("formInValid");
      setFormState(formState => ({
        ...formState,
        isValid: false
      }));
    }
    event.preventDefault();
  };

  const handleChangeAutoComplete = (targetName, event, value) => {
    event.persist();
    if (value !== null) {
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,
          [targetName]: value.id
        },
        stateCounter: formState.stateCounter + 1
      }));
      if (formState.errors.hasOwnProperty(targetName)) {
        delete formState.errors[targetName];
      }
    } else {
      if (formState.values[targetName]) {
        delete formState.values[targetName];
      }
    }
  };

  const hasError = field => (formState.errors[field] ? true : false);
  const classes = useStyles();
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={props.showModal}
      onClose={handleCloseModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
    >
      <Fade in={props.showModal}>
        <div className={classes.paper}>
          <Typography variant={"h2"} className={classes.textMargin}>
            {genericConstants.EDIT_TEXT}
          </Typography>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs>
                <TextField
                  fullWidth
                  id={get(ZoneSchema[ZONE_SCHEMA_NAME], "id")}
                  label={get(ZoneSchema[ZONE_SCHEMA_NAME], "label")}
                  name={ZONE_SCHEMA_NAME}
                  value={formState.values[ZONE_SCHEMA_NAME] || ""}
                  onChange={handleChange}
                  type={get(ZoneSchema[ZONE_SCHEMA_NAME], "type")}
                  variant="outlined"
                  margin="normal"
                  placeholder={get(ZoneSchema[ZONE_SCHEMA_NAME], "placeholder")}
                  error={hasError(ZONE_SCHEMA_NAME)}
                  helperText={
                    hasError(ZONE_SCHEMA_NAME)
                      ? formState.errors[ZONE_SCHEMA_NAME].map(error => {
                          return error + " ";
                        })
                      : null
                  }
                />
              </Grid>
              <Grid item xs>
                <Autocomplete
                  id="combo-box-demo"
                  options={formState.getstates}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) => {
                    handleChangeAutoComplete(STATE_SCEHMA_NAME, event, value);
                  }}
                  defaultValue={
                    formState.getstates[
                      formState.getstates.findIndex(function(item, i) {
                        return item.id === formState.values[STATE_SCEHMA_NAME];
                      })
                    ]
                  }
                  name={get(ZoneSchema[STATE_SCEHMA_NAME], "type")}
                  renderInput={params => (
                    <TextField
                      {...params}
                      error={hasError(STATE_SCEHMA_NAME)}
                      helperText={
                        hasError(STATE_SCEHMA_NAME)
                          ? formState.errors[STATE_SCEHMA_NAME].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                      name={STATE_SCEHMA_NAME}
                      key={option => option.id}
                      label={get(ZoneSchema[STATE_SCEHMA_NAME], "label")}
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  onClick={handleSubmit}
                >
                  {genericConstants.SAVE_BUTTON_TEXT}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Fade>
    </Modal>
  );
};

export default EditZone;
