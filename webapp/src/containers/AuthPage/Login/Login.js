import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { get } from "lodash";
import axios from "axios";
import { Redirect } from "react-router-dom";
import {
  Grid,
  Button,
  TextField,
  Link,
  Typography,
  CssBaseline,
  Box,
  Container,
  FormHelperText,
  FormControl,
  InputLabel,
  OutlinedInput,
  IconButton,
  InputAdornment
} from "@material-ui/core";
import useStyles from "./LoginStyles";
import form from "./loginform.json";
import {
  Alert,
  Auth as auth,
  Validation as validateInput,
  Logo
} from "../../../components";
import * as routeConstants from "../../../constants/RouteConstants";
import * as authPageConstants from "../../../constants/AuthPageConstants";
import * as strapiApiConstants from "../../../constants/StrapiApiConstants";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const identifier = "identifier";
const password = "password";

const LogIn = props => {
  const classes = useStyles();
  const [ifSuccess, setIfSuccess] = React.useState(false);
  const [ifFailure, setIfFailure] = React.useState(false);

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    isSuccess: false,
    showPassword: false
  });

  function checkAllKeysPresent(obj) {
    let areFieldsValid = false;
    Object.keys(form).map(field => {
      if (form[field]["required"] === true && obj.hasOwnProperty(field)) {
        areFieldsValid = true;
      } else {
        areFieldsValid = false;
      }
    });
    return areFieldsValid;
  }

  function count(obj) {
    return !Object.keys(obj).length ? true : false;
  }

  useEffect(() => {
    Object.keys(formState.values).map(field => {
      const errors = validateInput(
        formState.values[field],
        form[field]["validations"]
      );
      setFormState(formState => ({
        ...formState,
        isValid:
          !errors.length &&
          count(formState.errors) &&
          checkAllKeysPresent(formState.values)
            ? true
            : false,
        errors: errors.length
          ? {
              ...formState.errors,
              [field]: errors
            }
          : formState.errors
      }));
      if (!errors.length && formState.errors.hasOwnProperty(field)) {
        delete formState.errors[field];
      }
    });
  }, [formState.values]);

  const handleChange = e => {
    e.persist();
    setIfFailure(false);
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [e.target.name]: e.target.value
      },
      touched: {
        ...formState.touched,
        [e.target.name]: true
      }
    }));
  };

  if (ifSuccess && auth.getToken()) {
    return <Redirect to={routeConstants.DASHBOARD_URL} />;
  }

  const handleSignIn = event => {
    event.preventDefault();
    processLogin();
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const processLogin = async () => {
    await axios
      .post(
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_LOGIN_PATH,
        {
          identifier: formState.values.identifier,
          password: formState.values.password
        }
      )
      .then(response => {
        auth.setToken(response.data.jwt, true);
        auth.setUserInfo(response.data.user, true);
        console.log(auth.getUserInfo());
        setIfSuccess(true);
        // Handle success.
      })
      .catch(error => {
        setIfFailure(true);
        console.log("An error occurred:", error);
      });
  };

  const handleClickShowPassword = () => {
    setFormState({
      ...formState,
      showPassword: !formState.showPassword
    });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Box mt={1}>
          <center>
            <Logo />
          </center>
        </Box>
        <Typography component="h1" variant="h5" style={{ marginTop: ".9rem" }}>
          {authPageConstants.SIGN_IN_HEADER}
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSignIn}>
          <TextField
            id={get(form[identifier], "id")}
            variant="outlined"
            margin="normal"
            error={hasError("identifier")}
            fullWidth
            autoFocus={get(form[identifier], "autoFocus")}
            helperText={
              hasError(identifier)
                ? formState.errors[identifier].map(error => {
                    return error + " ";
                  })
                : null
            }
            label={get(form[identifier], "label")}
            name={identifier}
            onChange={handleChange}
            type={get(form[identifier], "type")}
            value={formState.values[identifier] || ""}
          />

          <FormControl
            fullWidth
            className={clsx(classes.margin, classes.textField)}
            variant="outlined"
          >
            <InputLabel
              htmlFor="outlined-adornment-password"
              fullWidth
              error={hasError(password)}
            >
              Password
            </InputLabel>
            <OutlinedInput
              id={get(form[password], "id")}
              name={password}
              type={formState.showPassword ? "text" : "password"}
              value={formState.values[password] || ""}
              onChange={handleChange}
              fullWidth
              error={hasError(password)}
              endAdornment={
                <InputAdornment position="end" error={hasError(password)}>
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {formState.showPassword ? (
                      <Visibility />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={70}
            ></OutlinedInput>
            <FormHelperText error={hasError(password)}>
              {hasError(password)
                ? formState.errors[password].map(error => {
                    return error + " ";
                  })
                : null}
            </FormHelperText>
          </FormControl>
          <Button
            color="primary"
            disabled={!formState.isValid}
            type="submit"
            fullWidth
            variant="contained"
            className={classes.submit}
          >
            {authPageConstants.SIGN_IN_BUTTON}
          </Button>
          <Grid container>
            <Grid item xs={6} style={{ textAlign: "center" }}>
              <Link href={routeConstants.FORGOT_PASSWORD_URL} variant="body2">
                {authPageConstants.FORGOT_PASSWORD_ROUTE_TEXT}
              </Link>
            </Grid>
            <Grid item xs={6} style={{ textAlign: "center" }}>
              <Link href={routeConstants.NEW_REGISTRATION_URL} variant="body2">
                {authPageConstants.NEW_REG_ROUTE_TEXT}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      {ifFailure ? (
        <Alert severity="error">{authPageConstants.INVALID_USER}</Alert>
      ) : null}
    </Container>
  );
};

export default LogIn;
