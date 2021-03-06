/* eslint-disable no-param-reassign */
import { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "../../../../util/@reduxjs/toolkit";
import {
  useInjectReducer,
  useInjectSaga,
} from "../../../../util/redux-injectors";
import Role from "../../../../types/Role";
import DeskRole from "../../../../types/DeskRole";
import Permission from "../../../../types/Permission";
import { rolesSaga } from "./saga";
import { OrgRolesState } from "./types";

export const initialState: OrgRolesState = {
  orgRoles: [],
  multiDeskRoles: [],
  deskRoles: [],
  orgPermissions: [],
  multiDeskPermissions: [],
  deskPermissions: [],
  orgRolesLoading: false,
  orgRoleUpdating: false,
  orgRoleDeleting: false,
  multiDeskRolesLoading: false,
  multiDeskRoleUpdating: false,
  multiDeskRoleDeleting: false,
  deskRolesLoading: false,
  deskRoleUpdating: false,
  deskRoleDeleting: false,
  orgPermissionsLoading: false,
  multiDeskPermissionsLoading: false,
  deskPermissionsLoading: false,
};

const slice = createSlice({
  name: "orgRoles",
  initialState,
  reducers: {
    getOrgRoles(state, action: PayloadAction<string>) {
      state.orgRolesLoading = true;
      state.orgRoles = [];
    },
    getOrgRolesSuccess(state, action: PayloadAction<Role[]>) {
      state.orgRolesLoading = false;
      state.orgRoles = action.payload;
    },
    getOrgRolesFailed(state) {
      state.orgRolesLoading = false;
    },
    editOrgRole(
      state,
      action: PayloadAction<{
        organizationId: string;
        roleId: string;
        vaultGroupId: string;
        oldPermissions: string[];
        role: Role;
      }>
    ) {
      state.orgRoleUpdating = true;
    },
    editOrgRoleSuccess(state, action: PayloadAction<string>) {
      state.orgRoleUpdating = false;
    },
    editOrgRoleFailed(state) {
      state.orgRoleUpdating = false;
    },
    deleteOrgRole(
      state,
      action: PayloadAction<{
        organizationId: string;
        roleId: string;
        vaultGroupId: string;
      }>
    ) {
      state.orgRoleDeleting = true;
    },
    deleteOrgRoleSuccess(state, action: PayloadAction<string>) {
      state.orgRoleDeleting = false;
    },
    deleteOrgRoleFailed(state) {
      state.orgRoleDeleting = false;
    },
    getOrgPermissions(state, action: PayloadAction<string>) {
      state.orgPermissionsLoading = true;
      state.orgPermissions = [];
    },
    getOrgPermissionsSuccess(state, action: PayloadAction<Permission[]>) {
      state.orgPermissionsLoading = false;
      state.orgPermissions = action.payload;
    },
    getOrgPermissionsFailed(state) {
      state.orgPermissionsLoading = false;
    },
    // multi-desk roles
    getMultiDeskRoles(state, action: PayloadAction<string>) {
      state.multiDeskRolesLoading = true;
      state.multiDeskRoles = [];
    },
    getMultiDeskRolesSuccess(state, action: PayloadAction<Role[]>) {
      state.multiDeskRolesLoading = false;
      state.multiDeskRoles = action.payload;
    },
    getMultiDeskRolesFailed(state) {
      state.multiDeskRolesLoading = false;
    },
    editMultiDeskRole(
      state,
      action: PayloadAction<{
        organizationId: string;
        roleId: string;
        vaultGroupId: string;
        oldPermissions: string[];
        role: Role;
      }>
    ) {
      state.multiDeskRoleUpdating = true;
    },
    editMultiDeskRoleSuccess(state, action: PayloadAction<string>) {
      state.multiDeskRoleUpdating = false;
    },
    editMultiDeskRoleFailed(state) {
      state.multiDeskRoleUpdating = false;
    },
    deleteMultiDeskRole(
      state,
      action: PayloadAction<{
        organizationId: string;
        roleId: string;
        vaultGroupId: string;
      }>
    ) {
      state.multiDeskRoleDeleting = true;
    },
    deleteMultiDeskRoleSuccess(state, action: PayloadAction<string>) {
      state.multiDeskRoleDeleting = false;
    },
    deleteMultiDeskRoleFailed(state) {
      state.multiDeskRoleDeleting = false;
    },
    getMultiDeskPermissions(
      state,
      action: PayloadAction<{ organizationId: string; deskId?: string }>
    ) {
      state.multiDeskPermissionsLoading = true;
      state.multiDeskPermissions = [];
    },
    getMultiDeskPermissionsSuccess(state, action: PayloadAction<Permission[]>) {
      state.multiDeskPermissionsLoading = false;
      state.multiDeskPermissions = action.payload;
    },
    getMultiDeskPermissionsFailed(state) {
      state.multiDeskPermissionsLoading = false;
    },
    // desk roles
    getDeskRoles(state, action: PayloadAction<string>) {
      state.deskRolesLoading = true;
      state.deskRoles = [];
    },
    getDeskRolesSuccess(state, action: PayloadAction<DeskRole[]>) {
      state.deskRolesLoading = false;
      state.deskRoles = action.payload;
    },
    getDeskRolesFailed(state) {
      state.deskRolesLoading = false;
    },
    editDeskRole(
      state,
      action: PayloadAction<{
        organizationId: string;
        deskId: string;
        roleId: string;
        vaultGroupId: string;
        oldPermissions: string[];
        role: Role;
      }>
    ) {
      state.deskRoleUpdating = true;
    },
    editDeskRoleSuccess(state, action: PayloadAction<string>) {
      state.deskRoleUpdating = false;
    },
    editDeskRoleFailed(state) {
      state.deskRoleUpdating = false;
    },
    deleteDeskRole(
      state,
      action: PayloadAction<{
        organizationId: string;
        deskId: string;
        roleId: string;
        vaultGroupId: string;
      }>
    ) {
      state.deskRoleDeleting = true;
    },
    deleteDeskRoleSuccess(state, action: PayloadAction<string>) {
      state.deskRoleDeleting = false;
    },
    deleteDeskRoleFailed(state) {
      state.deskRoleDeleting = false;
    },
    getDeskPermissions(
      state,
      action: PayloadAction<{ organizationId: string; deskId?: string }>
    ) {
      state.deskPermissionsLoading = true;
      state.deskPermissions = [];
    },
    getDeskPermissionsSuccess(state, action: PayloadAction<Permission[]>) {
      state.deskPermissionsLoading = false;
      state.deskPermissions = action.payload;
    },
    getDeskPermissionsFailed(state) {
      state.deskPermissionsLoading = false;
    },
  },
});

export const { actions: rolesActions, reducer } = slice;

export const useRolesSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: rolesSaga });
  (window as any).action = slice.actions;
  return { actions: slice.actions };
};
