/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from "react";
import Lockr from "lockr";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { TextField as MuiTextField } from "mui-rff";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  createStyles,
  Divider,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SearchIcon from "@material-ui/icons/Search";

import "bootstrap/dist/css/bootstrap.min.css";

import { useRolesSlice } from "./slice";
import {
  selectOrgRoles,
  selectIsOrgRolesLoading,
  selectMultiDeskRoles,
  selectIsMultiDeskRolesLoading,
  selectDeskRoles,
  selectIsDeskRolesLoading,
  selectIsRoleUpdating,
  selectIsRoleRemoving,
  selectOrgPermissions,
  selectIsOrgPermissionsLoading,
  selectMultiDeskPermissions,
  selectIsMultiDeskPermissionsLoading,
  selectDeskPermissions,
  selectIsDeskPermissionsLoading,
} from "./slice/selectors";
import Role from "../../../types/Role";
import DeskRole from "../../../types/DeskRole";
import Permission from "../../../types/Permission";
import Loader from "../../../components/Loader";

interface RoleType {
  name: string;
  permissions: Array<string>;
}
interface PermissionType {
  name: string;
  permissions: Array<{ code: string; name: string }>;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    roleName: {
      fontSize: theme.typography.pxToRem(16),
      fontWeight: "bold",
    },
    roleDescription: {
      fontSize: theme.typography.pxToRem(16),
      color: theme.palette.text.secondary,
    },
    permissionContainer: {
      padding: theme.spacing(2),
    },
    permissionDetails: {
      maxHeight: "40px",
      alignItems: "center",
      padding: "0px",
    },
    permissionName: {
      fontWeight: "bold",
    },
    checkboxLabel: {
      margin: "0px",
    },
    progressButtonWrapper: {
      margin: theme.spacing(1),
      position: "relative",
    },
    progressButton: {
      color: theme.palette.primary.main,
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12,
    },
    column: {
      flexBasis: "20%",
    },
    link: {
      color: theme.palette.primary.main,
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline",
      },
    },
    roleNameInput: {
      width: "100%",
      marginBottom: theme.spacing(2),
    },
    errorMessage: {
      marginTop: theme.spacing(8),
    },
    addButton: {
      padding: 0,
    },
    fullWidth: {
      width: "100%",
    },
    roleWrapper: {
      marginBottom: 10,
    },
  })
);

const orgRoleValidate = (values: any) => {
  const errors: Partial<RoleType> = {};

  if (!values.name) {
    errors.name = "This Field Required";
  }

  return errors;
};

const multiDeskRoleValidate = (values: any) => {
  const errors: Partial<RoleType> = {};

  if (!values.name) {
    errors.name = "This Field Required";
  }

  return errors;
};

const Roles = (): React.ReactElement => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { organizationId } = Lockr.get("USER_DATA");
  const { actions: rolesActions } = useRolesSlice();
  // organization roles
  const orgRoles = useSelector(selectOrgRoles);
  const orgPermissions = useSelector(selectOrgPermissions);
  const orgRolesLoading = useSelector(selectIsOrgRolesLoading);
  const orgPermissionsLoading = useSelector(selectIsOrgPermissionsLoading);
  // multi-desk roles
  const multiDeskRoles = useSelector(selectMultiDeskRoles);
  const multiDeskPermissions = useSelector(selectMultiDeskPermissions);
  const multiDeskRolesLoading = useSelector(selectIsMultiDeskRolesLoading);
  const multiDeskPermissionsLoading = useSelector(
    selectIsMultiDeskPermissionsLoading
  );
  // desk roles
  const deskRoles = useSelector(selectDeskRoles);
  const deskPermissions = useSelector(selectDeskPermissions);
  const deskRolesLoading = useSelector(selectIsDeskRolesLoading);
  const deskPermissionsLoading = useSelector(selectIsDeskPermissionsLoading);

  const roleUpdating = useSelector(selectIsRoleUpdating);
  const roleRemoving = useSelector(selectIsRoleRemoving);

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const roleCategories = [
    { name: "All roles", value: "all" },
    { name: "Organization roles", value: "organization" },
    { name: "Multi-desk roles", value: "multi-desk" },
    { name: "Desk roles", value: "desk" },
  ];

  useEffect(() => {
    let unmounted = false;

    const init = async () => {
      await dispatch(rolesActions.getOrgRoles(organizationId));
      await dispatch(rolesActions.getMultiDeskRoles(organizationId));
      await dispatch(rolesActions.getDeskRoles(organizationId));
      await dispatch(rolesActions.getOrgPermissions(organizationId));
      await dispatch(rolesActions.getMultiDeskPermissions({ organizationId }));
      await dispatch(rolesActions.getDeskPermissions({ organizationId }));
    };

    init();

    return () => {
      unmounted = true;
    };
  }, []);

  const onSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchText(value);
  };

  const onCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const onOrgRoleRemove = async (roleId: string) => {
    dispatch(rolesActions.deleteOrgRole({ organizationId, roleId }));
  };

  const onMultiDeskRoleRemove = async (roleId: string) => {
    dispatch(rolesActions.deleteMultiDeskRole({ organizationId, roleId }));
  };

  const onDeskRoleRemove = async (deskId: string, roleId: string) => {
    dispatch(rolesActions.deleteDeskRole({ organizationId, deskId, roleId }));
  };

  const handleOrgRoleUpdate = (values: any, roleId?: string) => {
    console.log(roleId, values);
    if (roleId) {
      dispatch(
        rolesActions.editOrgRole({ organizationId, roleId, role: values })
      );
    }
  };

  const handleMultiDeskRoleUpdate = (values: any, roleId?: string) => {
    console.log(roleId, values);
    if (roleId) {
      dispatch(
        rolesActions.editMultiDeskRole({ organizationId, roleId, role: values })
      );
    }
  };

  return (
    <div className="main-wrapper">
      <Container>
        <Grid container spacing={6}>
          <Grid item xs={3}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  className="w-100"
                  placeholder="Search..."
                  value={searchText}
                  onChange={onSearchTextChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <List component="nav" aria-label="investors">
                  {roleCategories
                    .filter((category) =>
                      category.name
                        .toLowerCase()
                        .includes(searchText.toLowerCase())
                    )
                    .map((category) => (
                      <ListItem
                        key={category.value}
                        button
                        onClick={() => onCategoryClick(category.value)}
                        selected={category.value === selectedCategory}
                      >
                        <ListItemText primary={category.name} />
                      </ListItem>
                    ))}
                </List>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={9}>
            <Grid container spacing={6}>
              {(selectedCategory === "all" ||
                selectedCategory === "organization") && (
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid xs={12}>
                      <Grid container spacing={2}>
                        <Grid item>
                          <Typography variant="h5">
                            Organization roles
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Link to="/roles/add">
                            <IconButton
                              color="inherit"
                              aria-label="Add Organization Role"
                              className={classes.addButton}
                            >
                              <AddCircleIcon fontSize="large" />
                            </IconButton>
                          </Link>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      {orgRolesLoading && <Loader />}
                      {!orgRolesLoading &&
                        (orgRoles.length > 0 ? (
                          <Grid container item>
                            <Grid item xs={12}>
                              {orgRoles
                                .filter(
                                  (role: Role) => role.name !== "_default"
                                )
                                .map((role: Role) => (
                                  <div className={classes.roleWrapper}>
                                    <Form
                                      onSubmit={(values) =>
                                        handleOrgRoleUpdate(values, role.id)
                                      }
                                      mutators={{
                                        ...arrayMutators,
                                      }}
                                      initialValues={role}
                                      validate={orgRoleValidate}
                                      render={({
                                        handleSubmit,
                                        submitting,
                                        pristine,
                                        form: {
                                          mutators: { push },
                                        },
                                        values,
                                      }) => (
                                        <form
                                          onSubmit={handleSubmit}
                                          noValidate
                                        >
                                          <Accordion key={role.id}>
                                            <AccordionSummary
                                              expandIcon={<ExpandMoreIcon />}
                                              aria-controls="panel1c-content"
                                            >
                                              <Grid
                                                container
                                                alignItems="center"
                                              >
                                                <Grid item>
                                                  <Typography
                                                    className={classes.roleName}
                                                  >
                                                    {role.name}
                                                  </Typography>
                                                </Grid>
                                                <Grid item>
                                                  <Typography
                                                    className={
                                                      classes.roleDescription
                                                    }
                                                  />
                                                </Grid>
                                              </Grid>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                              <Grid container item xs={12}>
                                                <Grid item xs={4}>
                                                  <MuiTextField
                                                    label="Role Name"
                                                    name="name"
                                                    variant="outlined"
                                                  />
                                                </Grid>
                                              </Grid>
                                            </AccordionDetails>
                                            {orgPermissionsLoading && (
                                              <Loader />
                                            )}
                                            {!orgPermissionsLoading && (
                                              <>
                                                {orgPermissions.map(
                                                  (perm: Permission) => (
                                                    <FormGroup
                                                      key={perm.name}
                                                      className={
                                                        classes.permissionContainer
                                                      }
                                                    >
                                                      <FormLabel
                                                        component="legend"
                                                        className={
                                                          classes.permissionName
                                                        }
                                                      >
                                                        {perm.name}
                                                      </FormLabel>
                                                      <AccordionDetails
                                                        className={
                                                          classes.permissionDetails
                                                        }
                                                      >
                                                        {perm.permissions.map(
                                                          (avail: {
                                                            name: string;
                                                            code: string;
                                                          }) => (
                                                            <Grid
                                                              item
                                                              key={avail.code}
                                                              xs={2}
                                                            >
                                                              <Grid
                                                                container
                                                                alignItems="center"
                                                                spacing={1}
                                                              >
                                                                <Grid item>
                                                                  <Field
                                                                    name="permissions[]"
                                                                    component="input"
                                                                    type="checkbox"
                                                                    value={
                                                                      avail.code
                                                                    }
                                                                  />
                                                                </Grid>
                                                                <Grid item>
                                                                  <Typography variant="body1">
                                                                    {avail.name}
                                                                  </Typography>
                                                                </Grid>
                                                              </Grid>
                                                            </Grid>
                                                          )
                                                        )}
                                                      </AccordionDetails>
                                                    </FormGroup>
                                                  )
                                                )}
                                              </>
                                            )}
                                            <Divider />
                                            <AccordionActions>
                                              <div
                                                className={
                                                  classes.progressButtonWrapper
                                                }
                                              >
                                                <Button
                                                  variant="contained"
                                                  size="small"
                                                  disabled={roleRemoving}
                                                  onClick={() =>
                                                    role.id &&
                                                    onOrgRoleRemove(role.id)
                                                  }
                                                >
                                                  Remove
                                                </Button>
                                                {roleRemoving && (
                                                  <CircularProgress
                                                    size={24}
                                                    className={
                                                      classes.progressButton
                                                    }
                                                  />
                                                )}
                                              </div>
                                              <div
                                                className={
                                                  classes.progressButtonWrapper
                                                }
                                              >
                                                <Button
                                                  variant="contained"
                                                  size="small"
                                                  color="primary"
                                                  type="submit"
                                                  disabled={
                                                    submitting || pristine
                                                  }
                                                >
                                                  Save
                                                </Button>
                                              </div>
                                            </AccordionActions>
                                          </Accordion>
                                        </form>
                                      )}
                                    />
                                  </div>
                                ))}
                            </Grid>
                          </Grid>
                        ) : (
                          <></>
                        ))}
                    </Grid>
                  </Grid>
                </Grid>
              )}
              {selectedCategory === "all" && (
                <Divider className={classes.fullWidth} />
              )}
              {(selectedCategory === "all" ||
                selectedCategory === "multi-desk") && (
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid xs={12}>
                      <Grid container spacing={2}>
                        <Grid item>
                          <Typography variant="h5">Multi-desk roles</Typography>
                        </Grid>
                        <Grid item>
                          <Link to="/multi-desk/roles/add">
                            <IconButton
                              color="inherit"
                              aria-label="Add Multi-Desk Role"
                              className={classes.addButton}
                            >
                              <AddCircleIcon fontSize="large" />
                            </IconButton>
                          </Link>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      {multiDeskRolesLoading && <Loader />}
                      {!multiDeskRolesLoading &&
                        (multiDeskRoles.length > 0 ? (
                          <Grid container item>
                            <Grid item xs={12}>
                              {multiDeskRoles
                                .filter(
                                  (role: Role) => role.name !== "_default"
                                )
                                .map((role: Role) => (
                                  <div className={classes.roleWrapper}>
                                    <Form
                                      onSubmit={(values) =>
                                        handleMultiDeskRoleUpdate(
                                          values,
                                          role.id
                                        )
                                      }
                                      mutators={{
                                        ...arrayMutators,
                                      }}
                                      initialValues={role}
                                      validate={multiDeskRoleValidate}
                                      render={({
                                        handleSubmit,
                                        submitting,
                                        pristine,
                                        form: {
                                          mutators: { push },
                                        },
                                        values,
                                      }) => (
                                        <form
                                          onSubmit={handleSubmit}
                                          noValidate
                                        >
                                          <Accordion key={role.id}>
                                            <AccordionSummary
                                              expandIcon={<ExpandMoreIcon />}
                                              aria-controls="panel1c-content"
                                            >
                                              <Grid
                                                container
                                                alignItems="center"
                                              >
                                                <Grid item>
                                                  <Typography
                                                    className={classes.roleName}
                                                  >
                                                    {role.name}
                                                  </Typography>
                                                </Grid>
                                              </Grid>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                              <Grid container item xs={12}>
                                                <Grid item xs={4}>
                                                  <MuiTextField
                                                    label="Role Name"
                                                    name="name"
                                                    variant="outlined"
                                                  />
                                                </Grid>
                                              </Grid>
                                            </AccordionDetails>
                                            {multiDeskPermissionsLoading && (
                                              <Loader />
                                            )}
                                            {!multiDeskPermissionsLoading && (
                                              <>
                                                {multiDeskPermissions.map(
                                                  (perm: Permission) => (
                                                    <FormGroup
                                                      key={perm.name}
                                                      className={
                                                        classes.permissionContainer
                                                      }
                                                    >
                                                      <FormLabel
                                                        component="legend"
                                                        className={
                                                          classes.permissionName
                                                        }
                                                      >
                                                        {perm.name}
                                                      </FormLabel>
                                                      <AccordionDetails
                                                        className={
                                                          classes.permissionDetails
                                                        }
                                                      >
                                                        {perm.permissions.map(
                                                          (avail: {
                                                            name: string;
                                                            code: string;
                                                          }) => (
                                                            <Grid
                                                              item
                                                              key={avail.code}
                                                              xs={2}
                                                            >
                                                              <Grid
                                                                container
                                                                alignItems="center"
                                                                spacing={1}
                                                              >
                                                                <Grid item>
                                                                  <Field
                                                                    name="permissions[]"
                                                                    component="input"
                                                                    type="checkbox"
                                                                    value={
                                                                      avail.code
                                                                    }
                                                                  />
                                                                </Grid>
                                                                <Grid item>
                                                                  <Typography variant="body1">
                                                                    {avail.name}
                                                                  </Typography>
                                                                </Grid>
                                                              </Grid>
                                                            </Grid>
                                                          )
                                                        )}
                                                      </AccordionDetails>
                                                    </FormGroup>
                                                  )
                                                )}
                                              </>
                                            )}
                                            <Divider />
                                            <AccordionActions>
                                              <div
                                                className={
                                                  classes.progressButtonWrapper
                                                }
                                              >
                                                <Button
                                                  variant="contained"
                                                  size="small"
                                                  disabled={roleRemoving}
                                                  onClick={() =>
                                                    role.id &&
                                                    onMultiDeskRoleRemove(
                                                      role.id
                                                    )
                                                  }
                                                >
                                                  Remove
                                                </Button>
                                                {roleRemoving && (
                                                  <CircularProgress
                                                    size={24}
                                                    className={
                                                      classes.progressButton
                                                    }
                                                  />
                                                )}
                                              </div>
                                              <div
                                                className={
                                                  classes.progressButtonWrapper
                                                }
                                              >
                                                <Button
                                                  variant="contained"
                                                  size="small"
                                                  color="primary"
                                                  type="submit"
                                                  disabled={
                                                    submitting || pristine
                                                  }
                                                >
                                                  Save
                                                </Button>
                                              </div>
                                            </AccordionActions>
                                          </Accordion>
                                        </form>
                                      )}
                                    />
                                  </div>
                                ))}
                            </Grid>
                          </Grid>
                        ) : (
                          <></>
                        ))}
                    </Grid>
                  </Grid>
                </Grid>
              )}
              {selectedCategory === "all" && (
                <Divider className={classes.fullWidth} />
              )}
              {/* {(selectedCategory === "all" || selectedCategory === "desk") && (
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid xs={12}>
                      <Grid container spacing={2}>
                        <Grid item>
                          <Typography variant="h5">Desk roles</Typography>
                        </Grid>
                        <Grid item>
                          <Link to="/desk/roles/add">
                            <IconButton
                              color="inherit"
                              aria-label="Add Desk Role"
                              className={classes.addButton}
                            >
                              <AddCircleIcon fontSize="large" />
                            </IconButton>
                          </Link>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      {deskRolesLoading && <Loader />}
                      {!deskRolesLoading &&
                        (orgRoles.length > 0 ? (
                          <Grid container item>
                            <Grid item xs={12}>
                              {deskRoles
                                .filter(
                                  (role: DeskRole) => role.name !== "_default"
                                )
                                .map((role: DeskRole) => (
                                  <Accordion key={role.id}>
                                    <AccordionSummary
                                      expandIcon={<ExpandMoreIcon />}
                                      aria-controls="panel1c-content"
                                    >
                                      <Grid
                                        container
                                        alignItems="center"
                                        spacing={2}
                                      >
                                        <Grid item>
                                          <Typography
                                            className={classes.roleName}
                                          >
                                            {role.name}
                                          </Typography>
                                        </Grid>
                                        <Grid item>
                                          <Typography
                                            color="textSecondary"
                                            className={classes.roleDescription}
                                          >
                                            {`(${role.desk.name})`}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                      <Grid container item xs={12}>
                                        <Grid item xs={4}>
                                          <TextField
                                            className={classes.roleNameInput}
                                            label="Role Name"
                                            value={role.name}
                                          />
                                        </Grid>
                                      </Grid>
                                    </AccordionDetails>
                                    {deskPermissionsLoading && <Loader />}
                                    {!deskPermissionsLoading && (
                                      <>
                                        {deskPermissions.map(
                                          (perm: Permission) => (
                                            <FormGroup
                                              key={perm.name}
                                              className={
                                                classes.permissionContainer
                                              }
                                            >
                                              <FormLabel
                                                component="legend"
                                                className={
                                                  classes.permissionName
                                                }
                                              >
                                                {perm.name}
                                              </FormLabel>
                                              <AccordionDetails
                                                className={
                                                  classes.permissionDetails
                                                }
                                              >
                                                {perm.permissions.map(
                                                  (avail: {
                                                    name: string;
                                                    code: string;
                                                  }) => (
                                                    <div
                                                      key={avail.code}
                                                      className={classes.column}
                                                    >
                                                      <FormControlLabel
                                                        className={
                                                          classes.checkboxLabel
                                                        }
                                                        control={
                                                          <Checkbox
                                                            color="primary"
                                                            name={avail.code}
                                                          />
                                                        }
                                                        label={avail.name}
                                                      />
                                                    </div>
                                                  )
                                                )}
                                              </AccordionDetails>
                                            </FormGroup>
                                          )
                                        )}
                                      </>
                                    )}
                                    <Divider />
                                    <AccordionActions>
                                      <div
                                        className={
                                          classes.progressButtonWrapper
                                        }
                                      >
                                        <Button
                                          variant="contained"
                                          size="small"
                                          disabled={roleRemoving}
                                          onClick={() =>
                                            role.id &&
                                            role.desk.id &&
                                            onDeskRoleRemove(
                                              role.desk.id,
                                              role.id
                                            )
                                          }
                                        >
                                          Remove
                                        </Button>
                                        {roleRemoving && (
                                          <CircularProgress
                                            size={24}
                                            className={classes.progressButton}
                                          />
                                        )}
                                      </div>
                                      <div
                                        className={
                                          classes.progressButtonWrapper
                                        }
                                      >
                                        <Button
                                          variant="contained"
                                          size="small"
                                          color="primary"
                                          type="submit"
                                          disabled={roleUpdating}
                                        >
                                          Save
                                        </Button>
                                      </div>
                                    </AccordionActions>
                                  </Accordion>
                                ))}
                            </Grid>
                          </Grid>
                        ) : (
                          <></>
                        ))}
                    </Grid>
                  </Grid>
                </Grid>
              )} */}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Roles;
