/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from "react";
import Lockr from "lockr";
import { useDispatch, useSelector } from "react-redux";
import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { TextField, Select } from "mui-rff";
import { useHistory } from "react-router";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Divider,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  MenuItem,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { useNewOrgRoleSlice } from "./slice";
import { useDesksSlice } from "../../Desks/slice";
import {
  selectDeskPermissions,
  selectIsDeskPermissionsLoading,
} from "./slice/selectors";
import { selectDesks, selectIsDesksLoading } from "../../Desks/slice/selectors";
import Loader from "../../../../components/Loader";
import { selectUser } from "../../../../slice/selectors";
import {
  selectOrgRoles,
  selectMultiDeskRoles,
  selectDeskRoles,
} from "../slice/selectors";
import { useRolesSlice } from "../slice";
import {
  createDeskRole,
  updateDeskRole,
} from "../../../../services/roleService";
import vault, { VaultPermissions } from "../../../../vault";
import { PermissionOwnerType } from "../../../../vault/enum/permission-owner-type";
import { VaultAssetType } from "../../../../vault/enum/asset-type";
import { snackbarActions } from "../../../../components/Snackbar/slice";
import Permission from "../../../../types/Permission";

interface RoleType {
  name: string;
  permissions: Array<string>;
}

interface PermissionType {
  name: string;
  permissions: Array<{ code: string; name: string }>;
}

interface deskType {
  id?: string;
  name: string;
}

const validate = (values: any) => {
  const errors: Partial<any> = {};

  if (!values.name) {
    errors.name = "This Field Required";
  }

  if (!values.deskId || values.deskId === "0") {
    errors.deskId = "This Field Required";
  }

  return errors;
};

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
      padding: theme.spacing(1),
      border: theme.palette.warning.main,
    },
    permissionDetails: {
      padding: "0px",
      height: "60px",
    },
    permissionName: {
      fontWeight: "bold",
      marginBottom: "10px",
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
      cursor: "pointer",
    },
    roleNameInput: {
      width: "100%",
      marginBottom: theme.spacing(2),
    },
  })
);

const NewDeskRole = (): React.ReactElement => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { organizationId } = Lockr.get("USER_DATA");
  const { actions: newDeskRoleActions } = useNewOrgRoleSlice();
  const { actions: desksActions } = useDesksSlice();
  const deskPermissions = useSelector(selectDeskPermissions);
  const deskPermissionsLoading = useSelector(selectIsDeskPermissionsLoading);
  const desks = useSelector(selectDesks);
  const desksLoading = useSelector(selectIsDesksLoading);
  const currentUser = useSelector(selectUser);
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardProccessing, setWizardProccessing] = useState(false);

  const orgRoles = useSelector(selectOrgRoles);
  const multiDeskRoles = useSelector(selectMultiDeskRoles);
  const deskRoles = useSelector(selectDeskRoles);
  const { actions: rolesActions } = useRolesSlice();
  const [newRole, setNewRole] = useState({
    name: "",
    id: "",
    vaultGroupId: "",
    deskId: "",
  });
  const [lockUsability, setLockUsability] = useState(false);

  useEffect(() => {
    let unmounted = false;

    const init = async () => {
      await dispatch(desksActions.getDesks());
      await dispatch(newDeskRoleActions.getDeskPermissions(organizationId));
      dispatch(rolesActions.getOrgRoles(organizationId));
      dispatch(rolesActions.getMultiDeskRoles(organizationId));
      dispatch(rolesActions.getDeskRoles(organizationId));
      setLockUsability(vault.checkUserLockUsability(currentUser));
    };

    init();

    return () => {
      unmounted = true;
    };
  }, []);

  const handleRoleCreate = async (values: any) => {
    setWizardProccessing(true);
    await createDeskRole(
      organizationId,
      values.deskId,
      values.name,
      currentUser?.vaultUserId as string
    )
      .then((data) => {
        dispatch(
          snackbarActions.showSnackbar({
            message: "Role has been created successfully",
            type: "success",
          })
        );
        setNewRole({
          name: values.name,
          id: data.id,
          vaultGroupId: data.vaultGroupId,
          deskId: values.deskId,
        });
        dispatch(rolesActions.getDeskRoles(organizationId));
        if (lockUsability) {
          setWizardStep(1);
        } else {
          setWizardStep(2);
        }
      })
      .catch((err) => {
        dispatch(
          snackbarActions.showSnackbar({
            message: err.message,
            type: "error",
          })
        );
      });
    setWizardProccessing(false);
  };

  const handleLockPermission = async (values: any) => {
    if (
      values.addRemoveUser.length ||
      values.createDeleteRuleTree.length ||
      values.getRuleTrees.length
    ) {
      setWizardProccessing(true);
      try {
        await vault.authenticate();
        await Promise.all(
          values.addRemoveUser.map(async (vaultGroupId: string) => {
            const request = await vault.grantPermissionToAsset(
              VaultAssetType.GROUP,
              newRole.vaultGroupId,
              PermissionOwnerType.group,
              vaultGroupId,
              VaultPermissions.AddRemoveUser,
              true
            );
            await vault.sendRequest(request);
          })
        );
        await Promise.all(
          values.createDeleteRuleTree.map(async (vaultGroupId: string) => {
            const request = await vault.grantPermissionToAsset(
              VaultAssetType.GROUP,
              newRole.vaultGroupId,
              PermissionOwnerType.group,
              vaultGroupId,
              VaultPermissions.CreateDeleteRuleTree,
              true
            );
            await vault.sendRequest(request);
          })
        );
        await Promise.all(
          values.getRuleTrees.map(async (vaultGroupId: string) => {
            const request = await vault.grantPermissionToAsset(
              VaultAssetType.GROUP,
              newRole.vaultGroupId,
              PermissionOwnerType.group,
              vaultGroupId,
              VaultPermissions.GetRuleTrees,
              true
            );
            await vault.sendRequest(request);
          })
        );
        setWizardStep(2);
      } catch (error) {
        dispatch(
          snackbarActions.showSnackbar({
            message: error.message,
            type: "error",
          })
        );
      }
      setWizardProccessing(false);
    } else {
      setWizardStep(2);
    }
  };

  const handleDefinePermission = async (values: any) => {
    setWizardProccessing(true);
    await updateDeskRole(
      organizationId,
      newRole.deskId,
      newRole.id,
      newRole.vaultGroupId,
      [],
      {
        name: newRole.name,
        permissions: values.permissions,
      }
    )
      .then((data) => {
        history.push("/roles");
      })
      .catch((error) => {
        if (Array.isArray(error.message)) {
          dispatch(
            snackbarActions.showSnackbar({
              message: error.message[0].constraints[Object.keys(error.message[0].constraints)[0]],
              type: "error",
            })
          );
        } else {
          dispatch(
            snackbarActions.showSnackbar({
              message: error.message,
              type: "error",
            })
          );
        }
        setWizardProccessing(false);
      });
  };

  const handleCancelClick = () => {
    history.push("/roles");
  };

  return (
    <div className="main-wrapper">
      <Container>
        {wizardStep === 0 && (
          <Form
            onSubmit={handleRoleCreate}
            validate={validate}
            render={({ handleSubmit }) => (
              <form onSubmit={handleSubmit} noValidate>
                <Card>
                  <CardHeader title="Create new Desk role" />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <TextField
                              className={classes.roleNameInput}
                              label="Role Name"
                              name="name"
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <Select
                              native
                              name="deskId"
                              label="Desk"
                              variant="outlined"
                              fullWidth
                            >
                              <option value="0">Select...</option>
                              {desks.map((deskItem: deskType) => (
                                <option key={deskItem.id} value={deskItem.id}>
                                  {deskItem.name}
                                </option>
                              ))}
                            </Select>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Divider />
                  <CardActions>
                    <Grid
                      container
                      alignItems="center"
                      justifyContent="flex-end"
                      spacing={2}
                    >
                      <Grid item>
                        <Button variant="contained" onClick={handleCancelClick}>
                          Cancel
                        </Button>
                      </Grid>
                      <Grid item>
                        <div className={classes.progressButtonWrapper}>
                          <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                            disabled={wizardProccessing && wizardStep === 0}
                          >
                            Next
                          </Button>
                          {wizardProccessing && wizardStep === 0 && (
                            <CircularProgress
                              size={24}
                              className={classes.progressButton}
                            />
                          )}
                        </div>
                      </Grid>
                    </Grid>
                  </CardActions>
                </Card>
              </form>
            )}
          />
        )}
        {wizardStep === 1 && (
          <Form
            onSubmit={handleLockPermission}
            initialValues={{
              addRemoveUser: [],
              createDeleteRuleTree: [],
              getRuleTrees: [],
            }}
            render={({ handleSubmit }) => (
              <form onSubmit={handleSubmit} noValidate>
                <Card>
                  <CardHeader title={`Permission of ${newRole.name}`} />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <FormGroup
                          className={`permission-container ${classes.permissionContainer}`}
                        >
                          <FormLabel
                            component="legend"
                            className={classes.permissionName}
                          >
                            Assign Users (AddRemoveUser)
                          </FormLabel>
                          <Grid container>
                            {orgRoles
                              .concat(multiDeskRoles, deskRoles)
                              .map((x) => (
                                <Grid item key={x.vaultGroupId} xs={3}>
                                  <Grid container wrap="nowrap" spacing={1}>
                                    <Grid item>
                                      <Field
                                        name="addRemoveUser[]"
                                        component="input"
                                        type="checkbox"
                                        value={x.vaultGroupId}
                                      />
                                    </Grid>
                                    <Grid item>
                                      <Typography variant="body1">
                                        {x.name}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              ))}
                          </Grid>
                        </FormGroup>
                        <FormGroup
                          className={`permission-container ${classes.permissionContainer}`}
                        >
                          <FormLabel
                            component="legend"
                            className={classes.permissionName}
                          >
                            Create Rules (CreateDeleteRuleTree)
                          </FormLabel>
                          <Grid container>
                            {orgRoles
                              .concat(multiDeskRoles, deskRoles)
                              .map((x) => (
                                <Grid item key={x.vaultGroupId} xs={3}>
                                  <Grid container wrap="nowrap" spacing={1}>
                                    <Grid item>
                                      <Field
                                        name="createDeleteRuleTree[]"
                                        component="input"
                                        type="checkbox"
                                        value={x.vaultGroupId}
                                      />
                                    </Grid>
                                    <Grid item>
                                      <Typography variant="body1">
                                        {x.name}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              ))}
                          </Grid>
                        </FormGroup>
                        <FormGroup
                          className={`permission-container ${classes.permissionContainer}`}
                        >
                          <FormLabel
                            component="legend"
                            className={classes.permissionName}
                          >
                            Display Rules (GetRuleTrees)
                          </FormLabel>
                          <Grid container>
                            {orgRoles
                              .concat(multiDeskRoles, deskRoles)
                              .map((x) => (
                                <Grid item key={x.vaultGroupId} xs={3}>
                                  <Grid container wrap="nowrap" spacing={1}>
                                    <Grid item>
                                      <Field
                                        name="getRuleTrees[]"
                                        component="input"
                                        type="checkbox"
                                        value={x.vaultGroupId}
                                      />
                                    </Grid>
                                    <Grid item>
                                      <Typography variant="body1">
                                        {x.name}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              ))}
                          </Grid>
                        </FormGroup>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Divider />
                  <CardActions>
                    <Grid
                      container
                      alignItems="center"
                      justifyContent="flex-end"
                      spacing={2}
                    >
                      <Grid item>
                        <Button variant="contained" onClick={handleCancelClick}>
                          Cancel
                        </Button>
                      </Grid>
                      <Grid item>
                        <div className={classes.progressButtonWrapper}>
                          <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                            disabled={wizardProccessing && wizardStep === 1}
                          >
                            Next
                          </Button>
                          {wizardProccessing && wizardStep === 1 && (
                            <CircularProgress
                              size={24}
                              className={classes.progressButton}
                            />
                          )}
                        </div>
                      </Grid>
                    </Grid>
                  </CardActions>
                </Card>
              </form>
            )}
          />
        )}
        {wizardStep === 2 && (
          <Form
            onSubmit={handleDefinePermission}
            initialValues={{
              permissions: [],
            }}
            render={({ handleSubmit }) => (
              <form onSubmit={handleSubmit} noValidate>
                <Card>
                  <CardHeader title="Define permissions" />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      {deskPermissionsLoading && <Loader />}
                      {!deskPermissionsLoading && (
                        <Grid item xs={12}>
                          <Grid container>
                            <Grid item xs={12}>
                              {deskPermissions.map(
                                (permissionGroup: Permission) => (
                                  <FormGroup
                                    key={permissionGroup.name}
                                    className={`permission-container ${classes.permissionContainer}`}
                                  >
                                    {permissionGroup.description ? (
                                      <Tooltip
                                        title={permissionGroup.description}
                                        placement="top-start"
                                        arrow
                                      >
                                        <FormLabel
                                          component="legend"
                                          className={`${classes.permissionName} ${classes.link}`}
                                        >
                                          {permissionGroup.name}
                                        </FormLabel>
                                      </Tooltip>
                                    ) : (
                                      <FormLabel
                                        component="legend"
                                        className={classes.permissionName}
                                      >
                                        {permissionGroup.name}
                                      </FormLabel>
                                    )}
                                    <Grid container>
                                      {permissionGroup.permissions.map(
                                        (permission: {
                                          name: string;
                                          description?: string;
                                          code: string;
                                        }) => (
                                          <Grid
                                            item
                                            key={permission.code}
                                            xs={2}
                                          >
                                            <Grid
                                              container
                                              wrap="nowrap"
                                              spacing={1}
                                            >
                                              <Grid item>
                                                <Field
                                                  name="permissions[]"
                                                  component="input"
                                                  type="checkbox"
                                                  value={permission.code}
                                                />
                                              </Grid>
                                              <Grid item>
                                                {permission.description ? (
                                                  <Tooltip
                                                    title={
                                                      permission.description
                                                    }
                                                    placement="top-start"
                                                    arrow
                                                  >
                                                    <Typography
                                                      variant="body2"
                                                      className={classes.link}
                                                    >
                                                      {permission.name}
                                                    </Typography>
                                                  </Tooltip>
                                                ) : (
                                                  <Typography variant="body2">
                                                    {permission.name}
                                                  </Typography>
                                                )}
                                              </Grid>
                                            </Grid>
                                          </Grid>
                                        )
                                      )}
                                    </Grid>
                                  </FormGroup>
                                )
                              )}
                            </Grid>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                  <Divider />
                  <CardActions>
                    <Grid
                      container
                      alignItems="center"
                      justifyContent="flex-end"
                      spacing={2}
                    >
                      <Grid item>
                        <Button variant="contained" onClick={handleCancelClick}>
                          Cancel
                        </Button>
                      </Grid>
                      <Grid item>
                        <div className={classes.progressButtonWrapper}>
                          <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                            disabled={wizardProccessing && wizardStep === 2}
                          >
                            Save
                          </Button>
                          {wizardProccessing && wizardStep === 2 && (
                            <CircularProgress
                              size={24}
                              className={classes.progressButton}
                            />
                          )}
                        </div>
                      </Grid>
                    </Grid>
                  </CardActions>
                </Card>
              </form>
            )}
          />
        )}
      </Container>
    </div>
  );
};

export default NewDeskRole;
