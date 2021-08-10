import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "react-final-form";
import { TextField, Select } from "mui-rff";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";
import { diff } from "deep-object-diff";
import {
  Avatar,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

import profile from "../../../assets/images/profile.jpg";
import { useCoWorkerFormSlice } from "./slice";
import { selectRoles } from "./slice/selectors";
import User from "../../../types/User";
import { selectUser } from "../../../slice/selectors";
import { GetVaultOrganizationResponseDto } from "../../../vault/dto/get-vault-organizations.dto";

const useStyles = makeStyles((theme) => ({
  sideMenu: {
    width: 230,
  },
  toolbar: theme.mixins.toolbar,
  listTitle: {
    display: "flex",
  },
  margin: {
    margin: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  selectRole: {
    width: 300,
  },
  roleSelectContainer: {
    display: "flex",
  },
  textInput: {
    minWidth: 230,
    margin: theme.spacing(2),
  },
  saveBtn: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  profileImageContainer: {
    position: "relative",
    maxWidth: 200,
  },
  profileImage: {
    width: "100%",
  },
  changeImageBtn: {
    position: "absolute",
    bottom: 45,
    left: 0,
  },
  fixSelectLabel: {
    color: "red",
    "& fieldset>legend ": {
      maxWidth: 1000,
      transition: "max-width 100ms cubic-bezier(0.0, 0, 0.2, 1) 50ms",
    },
  },
  logoImageContainer: {
    position: "relative",
    width: 200,
    height: 200,
    margin: "auto",
    "&:hover, &:focus": {
      "& $logoImage": {
        opacity: 0.5,
      },
    },
  },
  logoImage: {
    width: "100%",
    height: "100%",
    opacity: 1,
  },
  logoFileInput: {
    opacity: 0,
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    cursor: "pointer",
  },
}));

const validate = (values: any) => {
  const errors: { [key: string]: string } = {};
  if (!values.nickname) {
    errors.nickname = "This Field Required";
  }

  if (!values.email) {
    errors.email = "This Field Required";
  }

  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Please enter a valid Email";
  }

  if (!values.jobTitle) {
    errors.jobTitle = "This Field Required";
  }

  if (!values.phone) {
    errors.phone = "This Field Required";
  }

  if (
    // eslint-disable-next-line no-useless-escape
    !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(
      values.phone
    )
  ) {
    errors.phone = "Please enter a valid Phone number";
  }
  return errors;
};

interface CoWorkerFormProps {
  // eslint-disable-next-line react/require-default-props
  coWorker: Partial<User>;
  onSubmit: (coWorker: User) => void;
  onSendResetPasswordLink: () => void;
  onResetOTP: () => void;
}

const CoWorkerForm: React.FC<CoWorkerFormProps> = ({
  onSubmit,
  onSendResetPasswordLink,
  onResetOTP,
  coWorker,
}: CoWorkerFormProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { actions } = useCoWorkerFormSlice();
  const existingRoles = useSelector(selectRoles);

  const currentUser = useSelector(selectUser);

  const canCreateVaultUser =
    currentUser &&
    currentUser.vaultUserId &&
    coWorker.publicKeys &&
    coWorker.publicKeys[0] &&
    !coWorker.vaultUserId;

  useEffect(() => {
    dispatch(actions.getRoles());
  }, []);

  const handleOnSubmit = (values: any) => {
    const updates: Partial<User> = diff(coWorker, values);
    updates.roles = values.roles;
    onSubmit(updates as User);
  };

  const handleAddVaultUser = () => {
    console.log("handle add to vault ", coWorker, currentUser);
    if (coWorker.id && coWorker.publicKeys && coWorker.publicKeys[0]) {
      dispatch(
        actions.addUserToVault({
          userId: coWorker.id,
          publicKey: coWorker.publicKeys[0],
        })
      );
    }
  };
  return (
    <Container>
      <Form
        onSubmit={handleOnSubmit}
        mutators={{
          ...arrayMutators,
        }}
        initialValues={coWorker}
        validate={validate}
        render={({
          handleSubmit,
          submitting,
          pristine,
          form: {
            mutators: { push },
          },
          values,
        }) => (
          <form onSubmit={handleSubmit} noValidate>
            <Grid container alignItems="flex-start" spacing={2}>
              <Grid item xs={12}>
                <FieldArray name="roles">
                  {({ fields }) =>
                    fields.map((name, i) => (
                      <Grid container key={name} spacing={2}>
                        <Grid
                          item
                          xs={6}
                          className={
                            values.roles[i] ? classes.fixSelectLabel : ""
                          }
                        >
                          <Select
                            native
                            name={`${name}.id`}
                            inputProps={{
                              name: "role",
                              id: "role-select",
                            }}
                            fullWidth
                            label="Role"
                            variant="outlined"
                            inputLabelProps={{
                              shrink: !!values.roles[i].id,
                              filled: true,
                            }}
                          >
                            <option aria-label="None" value="" />
                            {existingRoles
                              .filter(
                                (role) =>
                                  values.roles[i].id === role.id ||
                                  values.roles.filter(
                                    (r: any) => r.id === role.id
                                  ).length === 0
                              )
                              .map((r) => (
                                <option key={r.id} value={r.id}>
                                  {r.name}
                                </option>
                              ))}
                          </Select>
                        </Grid>
                        {i !== 0 && (
                          <Grid item xs={1}>
                            <IconButton
                              onClick={() => fields.remove(i)}
                              aria-label="Add role"
                            >
                              <DeleteForeverIcon />
                            </IconButton>
                          </Grid>
                        )}
                        {fields &&
                          i === (fields.length || 0) - 1 &&
                          (fields.length || 0) < existingRoles.length && (
                            <Grid item xs={1}>
                              <IconButton
                                onClick={() => push("roles", { id: "" })}
                                aria-label="Add role"
                              >
                                <AddCircleOutlineIcon />
                              </IconButton>
                            </Grid>
                          )}
                      </Grid>
                    ))
                  }
                </FieldArray>
              </Grid>
              {coWorker.roles && coWorker.roles.length > 0 && (
                <Grid item xs={12}>
                  <Divider variant="fullWidth" />
                </Grid>
              )}
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={8}>
                    <Grid container spacing={2}>
                      {/* <Grid item xs={6}>
                        <Select
                          label="Status"
                          native
                          name="suspended"
                          variant="outlined"
                          inputProps={{
                            name: "suspended",
                            id: "suspended-select",
                          }}
                        >
                          <option aria-label="None" value="" />
                          <option value="true">Active</option>
                          <option value="false">Disabled</option>
                        </Select>
                      </Grid> */}
                      <Grid item xs={12}>
                        <TextField
                          required
                          id="nickname"
                          name="nickname"
                          label="Nickname"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          required
                          id="email"
                          name="email"
                          label="Email"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          required
                          label="Phone"
                          name="phone"
                          id="phone"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          id="job-title"
                          label="Job title"
                          name="jobTitle"
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                    {canCreateVaultUser && (
                      <Grid container spacing={3}>
                        <Grid item sm={12} md={6}>
                          <Button
                            fullWidth
                            color="primary"
                            onClick={handleAddVaultUser}
                          >
                            Add to vault
                          </Button>
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                  <Grid item xs={4}>
                    <div className={classes.logoImageContainer}>
                      <Avatar
                        src={profile}
                        alt="Avatar"
                        className={classes.logoImage}
                      />
                      {/* <input
                        type="file"
                        name="avatar"
                        className={classes.logoFileInput}
                        onChange={onLogoFileChange}
                      /> */}
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Grid container justify="flex-end" spacing={2}>
                  {coWorker.id && (
                    <Grid item>
                      <Button
                        onClick={onResetOTP}
                        color="primary"
                        variant="contained"
                      >
                        Reset OTP Key
                      </Button>
                    </Grid>
                  )}
                  {coWorker.id && (
                    <Grid item>
                      <Button
                        onClick={onSendResetPasswordLink}
                        color="primary"
                        variant="contained"
                      >
                        Send Reset Password Link
                      </Button>
                    </Grid>
                  )}
                  <Grid item>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={submitting || pristine}
                    >
                      Save Changes
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>
        )}
      />
    </Container>
  );
};

// CoWorkerForm.defaultProps = defaultProps;
export default CoWorkerForm;
