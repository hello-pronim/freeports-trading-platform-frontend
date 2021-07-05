import { useDispatch } from "react-redux";
import {
  getOrganizations,
  getOrganizationDetail,
  getOrganizationManagers,
  getOrganizerManager,
  addOrganizationManager,
  addOrganizer,
  addAccount,
  updateOrganizer,
  updateOrganizerManager,
  suspendManager,
  resumeManager,
} from "../services/organizationService";
import reduxActions from "../store/actions";

const { clearError, setError } = reduxActions;

function useOrganization(): any {
  const dispatch = useDispatch();

  const organizers = async (
    pageNum: number,
    pagelimit: number,
    searchVal: string
  ) => {
    dispatch(clearError());
    const organizations = await getOrganizations(pageNum, pagelimit, searchVal)
      .then((data: any) => {
        return data;
      })
      .catch((err) => {
        dispatch(setError(err));
      });
    return organizations;
  };
  const getOrganizerdetail = async (id: string) => {
    dispatch(clearError());
    const organizationDetail = await getOrganizationDetail(id)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        dispatch(setError(err));
      });
    return organizationDetail;
  };

  const getManagers = async (id: string) => {
    dispatch(clearError());
    const managers = await getOrganizationManagers(id)
      .then((data) => {
        return data.content;
      })
      .catch((err) => {
        dispatch(setError(err));
      });
    return managers;
  };

  const addManager = async (
    organizerId: string,
    nickname: string,
    email: string,
    password: string,
    phone: string,
    avatar: string
  ) => {
    dispatch(clearError());
    const manager = await addOrganizationManager(
      organizerId,
      nickname,
      email,
      password,
      phone,
      avatar
    )
      .then((data) => {
        return data;
      })
      .catch((err) => {
        dispatch(setError(err));
      });
    return manager;
  };

  const getOrganizedManager = async (
    organizedId: string,
    managerId: string
  ) => {
    dispatch(clearError());
    const manager = await getOrganizerManager(organizedId, managerId)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        dispatch(setError(err));
      });
    return manager;
  };

  const addOrganization = async (
    name: string,
    street: string,
    street2: string,
    zip: string,
    city: string,
    country: string,
    logo: string,
    commissionOrganization: string,
    commissionClearer: string
  ) => {
    dispatch(clearError());
    const newOrganization = await addOrganizer(
      name,
      street,
      street2,
      zip,
      city,
      country,
      logo,
      commissionOrganization,
      commissionClearer
    )
      .then((data) => {
        return data;
      })
      .catch((err) => {
        dispatch(setError(err));
      });
    return newOrganization;
  };

  const additionAccount = async (
    organizerId: string,
    name: string,
    currency: string,
    type: string,
    iban: string,
    publicAddress: string,
    vaultWalletId: string
  ) => {
    dispatch(clearError());
    const newAddAccount = await addAccount(
      organizerId,
      name,
      currency,
      type,
      iban,
      publicAddress,
      vaultWalletId
    )
      .then((data) => {
        return data;
      })
      .catch((err) => {
        dispatch(setError(err));
      });
    return newAddAccount;
  };

  const updateOrganization = async (
    organizerId: string,
    createdAt: Date,
    name: string,
    logo: string,
    commissionOrganization: string,
    commissionClearer: string
  ) => {
    dispatch(clearError());
    const updatedOrganization = await updateOrganizer(
      organizerId,
      createdAt,
      name,
      logo,
      commissionOrganization,
      commissionClearer
    )
      .then((data) => {
        return data;
      })
      .catch((err) => {
        dispatch(setError(err));
      });
    return updatedOrganization;
  };

  const updateOrganizationManager = async (
    organizerId: string,
    managerId: string,
    nickname: string,
    email: string,
    phone: string,
    avatar: string
  ) => {
    dispatch(clearError());
    const updatedOrganizationManager = await updateOrganizerManager(
      organizerId,
      managerId,
      nickname,
      email,
      phone,
      avatar
    )
      .then((data) => {
        return data;
      })
      .catch((err) => {
        dispatch(setError(err));
      });
    return updatedOrganizationManager;
  };

  const suspendOrganizationManager = async (
    organizerId: string,
    managerId: string
  ) => {
    dispatch(clearError());
    const suspend = await suspendManager(organizerId, managerId)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        dispatch(setError(err));
      });
    return suspend;
  };

  const resumeOrganizationManager = async (
    organizerId: string,
    managerId: string
  ) => {
    dispatch(clearError());
    const resume = await resumeManager(organizerId, managerId)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        dispatch(setError(err));
      });
    return resume;
  };

  return {
    organizers,
    getOrganizerdetail,
    getManagers,
    addManager,
    getOrganizedManager,
    addOrganization,
    additionAccount,
    updateOrganization,
    updateOrganizationManager,
    suspendOrganizationManager,
    resumeOrganizationManager,
  };
}

export default useOrganization;
