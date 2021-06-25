import { PayloadAction } from "@reduxjs/toolkit";
import {
  takeEvery,
  call,
  put,
  select,
  take,
  takeLatest,
  delay,
} from "redux-saga/effects";

import { coWorkActions as actions } from ".";
import getClearerUsers, {
  createClearerUser,
  getClearerUser,
  suspendClearerUser,
  resumeClearerUser,
  updateClearerUser,
} from "../../../../services/clearerUsersService";
import {
  assignClearerRolesToUser,
  updateClearerRolesToUser,
} from "../../../../services/roleService";
import PaginatedResponse from "../../../../types/PaginatedResponse";
import { ResourceCreatedResponse } from "../../../../types/ResourceCreatedResponse";
import User from "../../../../types/User";
import { selectCoWorkers, selectSelectedCoWorker } from "./selectors";
import { snackbarActions } from "../../../../components/Snackbar/slice";

export function* getCoWorkers({
  payload,
}: PayloadAction<{ search?: string }>): Generator<any> {
  try {
    yield delay(300);
    const response = yield call(getClearerUsers, payload.search);
    yield put(
      actions.getCoWorkersSuccess((response as PaginatedResponse<User>).content)
    );
  } catch (error) {
    console.log("error", error);
  }
}

export function* createCoWorker({
  payload,
}: PayloadAction<{ user: User }>): Generator<any> {
  try {
    const response = yield call(createClearerUser, payload.user);

    // assign user roles
    if (payload.user.roles?.length) {
      yield call(
        assignClearerRolesToUser,
        (response as ResourceCreatedResponse).id,
        payload.user.roles
      );
    }
    yield put(
      actions.createCoWorkerSuccess(response as ResourceCreatedResponse)
    );
    yield put(
      snackbarActions.showSnackbar({
        message: "Co-Worker Created",
        type: "success",
      })
    );
    yield put(actions.getCoWorkers({}));

    yield take(actions.getCoWorkersSuccess);

    const coWorkers = yield select(selectCoWorkers);
    const selectedCoWorker = (coWorkers as Array<User>).find(
      (c) => c.id === (response as ResourceCreatedResponse).id
    );
    if (selectedCoWorker) {
      yield put(actions.selectCoWorker(selectedCoWorker));
    }
  } catch (error) {
    console.log("error", error);
  }
}
export function* updateCoWorker({
  payload,
}: PayloadAction<{ user: User; id: string }>): Generator<any> {
  try {
    console.log("update user saga ", payload);
    const response = yield call(updateClearerUser, payload.id, payload.user);
    if (payload.user.roles) {
      yield call(
        updateClearerRolesToUser,
        (response as ResourceCreatedResponse).id,
        payload.user.roles
      );
    }

    yield put(
      actions.updateCoWorkerSuccess(response as ResourceCreatedResponse)
    );
    yield put(
      snackbarActions.showSnackbar({
        message: "Co-Worker updated",
        type: "success",
      })
    );
    yield put(actions.getCoWorkers({}));

    yield take(actions.getCoWorkersSuccess);

    const coWorkers = yield select(selectCoWorkers);
    const selectedCoWorker = (coWorkers as Array<User>).find(
      (c) => c.id === (response as ResourceCreatedResponse).id
    );
    if (selectedCoWorker) {
      yield put(actions.selectCoWorker(selectedCoWorker));
    }
  } catch (error) {
    console.log("error", error);
  }
}

export function* getCoWorker({ payload }: PayloadAction<User>): Generator<any> {
  try {
    if (payload.id) {
      const response = yield call(getClearerUser, payload.id);
      yield put(actions.selectCoWorkerSuccess(response as User));
    } else {
      yield put(actions.selectCoWorkerSuccess(payload));
    }
  } catch (error) {
    console.log("error", error);
  }
}
export function* suspendCoWorker({
  payload,
}: PayloadAction<{ id: string }>): Generator<any> {
  try {
    if (payload.id) {
      yield call(suspendClearerUser, payload.id);
      yield put(actions.suspendCoWorkerSuccess());
      const selectedCoWorker = yield select(selectSelectedCoWorker);
      yield put(actions.selectCoWorker(selectedCoWorker as User));
      yield put(
        snackbarActions.showSnackbar({
          message: "User Suspended",
          type: "success",
        })
      );
    }
  } catch (error) {
    console.log("error", error);
  }
}
export function* resumeCoWorker({
  payload,
}: PayloadAction<{ id: string }>): Generator<any> {
  try {
    if (payload.id) {
      yield call(resumeClearerUser, payload.id);
      yield put(actions.resumeCoWorkerSuccess());
      const selectedCoWorker = yield select(selectSelectedCoWorker);
      yield put(actions.selectCoWorker(selectedCoWorker as User));
      yield put(
        snackbarActions.showSnackbar({
          message: "User reactivated",
          type: "success",
        })
      );
    }
  } catch (error) {
    console.log("error", error);
  }
}

export function* coWorkersSaga(): Generator<any> {
  yield takeLatest(actions.getCoWorkers, getCoWorkers);
  yield takeEvery(actions.createCoWorker, createCoWorker);
  yield takeEvery(actions.selectCoWorker, getCoWorker);
  yield takeEvery(actions.updateCoWorker, updateCoWorker);
  yield takeEvery(actions.suspendCoWorker, suspendCoWorker);
  yield takeEvery(actions.resumeCoWorker, resumeCoWorker);
}
