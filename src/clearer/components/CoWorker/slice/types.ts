import User from "../../../../types/User";

/* --- STATE --- */
export interface ClearerCoWorkersState {
  coWorkers: User[];
  selectedCoWorker: User;
  loading: boolean;
  formLoading: boolean;
  suspendStateLoading: boolean;
}
