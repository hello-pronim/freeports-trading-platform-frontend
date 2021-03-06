export const PermissionClearer = {
  coworkerRead: "clearer.coworker.read",
  coworkerCreate: "clearer.coworker.create",
  coworkerUpdate: "clearer.coworker.update",
  coworkerState: "clearer.coworker.state",

  roleRead: "clearer.role.read",
  roleCreate: "clearer.role.create",
  roleUpdate: "clearer.role.update",
  roleDelete: "clearer.role.delete",
  roleAssign: "clearer.role.assign",

  organizationRead: "clearer.organization.read",
  organizationCreate: "clearer.organization.create",
  organizationUpdate: "clearer.organization.update",
  organizationDisable: "clearer.organization.disable",

  accountRead: "clearer.account.read",
  accountCreate: "clearer.account.create",
  accountUpdate: "clearer.account.update",
  accountDelete: "clearer.account.delete",
  accountAssign: "clearer.account.assign",

  operationRead: "clearer.operation.read",
  operationCreate: "clearer.operation.create",
  operationUpdate: "clearer.operation.update",
  operationDelete: "clearer.operation.delete",
  operationReconcile: "clearer.operation.reconcile",

  organizationManagerRead: "clearer.organization.manager.read",
  organizationManagerCreate: "clearer.organization.manager.create",
  organizationManagerUpdate: "clearer.organization.manager.update",
  organizationManagerState: "clearer.organization.manager.state",
} as const;

export const PermissionClearerGroup = [
  {
    name: "Coworker",
    permissions: [
      {
        name: "Read",
        code: PermissionClearer.coworkerRead,
      },
      {
        name: "Create",
        code: PermissionClearer.coworkerCreate,
      },
      {
        name: "Update",
        code: PermissionClearer.coworkerUpdate,
      },
      {
        name: "Suspend/Resume",
        code: PermissionClearer.coworkerState,
      },
    ],
  },
  {
    name: "Role",
    permissions: [
      {
        name: "Read",
        code: PermissionClearer.roleRead,
      },
      {
        name: "Create",
        code: PermissionClearer.roleCreate,
      },
      {
        name: "Update",
        code: PermissionClearer.roleUpdate,
      },
      {
        name: "Delete",
        code: PermissionClearer.roleDelete,
      },
      {
        name: "Assign",
        code: PermissionClearer.roleAssign,
      },
    ],
  },
  {
    name: "Organization",
    permissions: [
      {
        name: "Read",
        code: PermissionClearer.organizationRead,
      },
      {
        name: "Create",
        code: PermissionClearer.organizationCreate,
      },
      {
        name: "Update",
        code: PermissionClearer.organizationUpdate,
      },
      {
        name: "Disable",
        code: PermissionClearer.organizationDisable,
      },
    ],
  },
  {
    name: "Account",
    permissions: [
      {
        name: "Read",
        code: PermissionClearer.accountRead,
      },
      {
        name: "Create",
        code: PermissionClearer.accountCreate,
      },
      {
        name: "Update",
        code: PermissionClearer.accountUpdate,
      },
      {
        name: "Delete",
        code: PermissionClearer.accountDelete,
      },
      {
        name: "Assign",
        code: PermissionClearer.accountAssign,
      },
    ],
  },
  {
    name: "Account operation",
    permissions: [
      {
        name: "Read",
        code: PermissionClearer.operationRead,
      },
      {
        name: "Create",
        code: PermissionClearer.operationCreate,
      },
      {
        name: "Update",
        code: PermissionClearer.operationUpdate,
      },
      {
        name: "Delete",
        code: PermissionClearer.operationDelete,
      },
      {
        name: "Reconcile",
        code: PermissionClearer.operationReconcile,
      },
    ],
  },
  {
    name: "Organization manager",
    permissions: [
      {
        name: "Read",
        code: PermissionClearer.organizationManagerRead,
      },
      {
        name: "Create",
        code: PermissionClearer.organizationManagerCreate,
      },
      {
        name: "Update",
        code: PermissionClearer.organizationManagerUpdate,
      },
      {
        name: "Suspend/Resume",
        code: PermissionClearer.organizationManagerState,
      },
    ],
  },
];

export const PermissionOrganization = {
  coworkerRead: "organization.#organizationId#.coworker.read",
  coworkerCreate: "organization.#organizationId#.coworker.create",
  coworkerUpdate: "organization.#organizationId#.coworker.update",
  coworkerState: "organization.#organizationId#.coworker.state",

  organizationRead: "organization.#organizationId#.read",
  organizationUpdate: "organization.#organizationId#.update",

  roleRead: "organization.#organizationId#.role.read",
  roleCreate: "organization.#organizationId#.role.create",
  roleUpdate: "organization.#organizationId#.role.update",
  roleDelete: "organization.#organizationId#.role.delete",
  roleAssign: "organization.#organizationId#.role.assign",

  deskRead: "organization.#organizationId#.desk.read",
  deskCreate: "organization.#organizationId#.desk.create",
  deskUpdate: "organization.#organizationId#.desk.update",
  deskDisable: "organization.#organizationId#.desk.disable",
  deskDelete: "organization.#organizationId#.desk.delete",

  deskUserRead: "organization.#organizationId#.desk.user.read",
  deskUserCreate: "organization.#organizationId#.desk.user.create",
  deskUserUpdate: "organization.#organizationId#.desk.user.update",
  deskUserState: "organization.#organizationId#.desk.user.state",
} as const;

export const PermissionOrganizationGroup = [
  {
    name: "Organization",
    permissions: [
      {
        name: "Read",
        code: PermissionOrganization.organizationRead,
      },
      {
        name: "Update",
        code: PermissionOrganization.organizationUpdate,
      },
    ],
  },
  {
    name: "Coworker",
    permissions: [
      {
        name: "Read",
        code: PermissionOrganization.coworkerRead,
      },
      {
        name: "Create",
        code: PermissionOrganization.coworkerCreate,
      },
      {
        name: "Update",
        code: PermissionOrganization.coworkerUpdate,
      },
      {
        name: "Suspend/Resume",
        code: PermissionOrganization.coworkerState,
      },
    ],
  },
  {
    name: "Role",
    permissions: [
      {
        name: "Read",
        code: PermissionOrganization.roleRead,
      },
      {
        name: "Create",
        code: PermissionOrganization.roleCreate,
      },
      {
        name: "Update",
        code: PermissionOrganization.roleUpdate,
      },
      {
        name: "Delete",
        code: PermissionOrganization.roleDelete,
      },
      {
        name: "Assign",
        code: PermissionOrganization.roleAssign,
      },
    ],
  },
  {
    name: "Desk",
    permissions: [
      {
        name: "Read",
        code: PermissionOrganization.deskRead,
      },
      {
        name: "Create",
        code: PermissionOrganization.deskCreate,
      },
      {
        name: "Update",
        code: PermissionOrganization.deskUpdate,
      },
      {
        name: "Disable",
        code: PermissionOrganization.deskDisable,
      },
      {
        name: "Delete",
        code: PermissionOrganization.deskDelete,
      },
    ],
  },
  {
    name: "Desk user",
    permissions: [
      {
        name: "Read",
        code: PermissionOrganization.deskUserRead,
      },
      {
        name: "Create",
        code: PermissionOrganization.deskUserCreate,
      },
      {
        name: "Update",
        code: PermissionOrganization.deskUserUpdate,
      },
      {
        name: "Suspend/Resume",
        code: PermissionOrganization.deskUserState,
      },
    ],
  },
];

export const PermissionDesk = {
  coworkerRead: "desk.#deskId#.coworker.read",
  coworkerCreate: "desk.#deskId#.coworker.create",
  coworkerUpdate: "desk.#deskId#.coworker.update",
  coworkerState: "desk.#deskId#.coworker.state",

  roleRead: "desk.#deskId#.role.read",
  roleCreate: "desk.#deskId#.role.create",
  roleUpdate: "desk.#deskId#.role.update",
  roleDelete: "desk.#deskId#.role.delete",
  roleAssign: "desk.#deskId#.role.assign",

  investorRead: "desk.#deskId#.investor.read",
  investorCreate: "desk.#deskId#.investor.create",
  investorUpdate: "desk.#deskId#.investor.update",
  investorDelete: "desk.#deskId#.investor.delete",
  investorDisable: "desk.#deskId#.investor.disable",

  accountRead: "desk.#deskId#.account.read",
  accountCreate: "desk.#deskId#.account.create",
  accountDelete: "desk.#deskId#.account.delete",

  requestTrade: "desk.#deskId#.request.trade",
  requestFund: "desk.#deskId#.request.fund",
  requestRefund: "desk.#deskId#.request.refund",
  requestMove: "desk.#deskId#.request.move",

  validateTrade: "desk.#deskId#.validate.trade",
  validateFund: "desk.#deskId#.validate.fund",
  validateRefund: "desk.#deskId#.validate.refund",
  validateMove: "desk.#deskId#.validate.move",
} as const;

export const PermissionDeskGroup = [
  {
    name: "Coworker",
    permissions: [
      {
        name: "Read",
        code: PermissionDesk.coworkerRead,
      },
      {
        name: "Create",
        code: PermissionDesk.coworkerCreate,
      },
      {
        name: "Update",
        code: PermissionDesk.coworkerUpdate,
      },
      {
        name: "Suspend/Resume",
        code: PermissionDesk.coworkerState,
      },
    ],
  },
  {
    name: "Role",
    permissions: [
      {
        name: "Read",
        code: PermissionDesk.roleRead,
      },
      {
        name: "Create",
        code: PermissionDesk.roleCreate,
      },
      {
        name: "Update",
        code: PermissionDesk.roleUpdate,
      },
      {
        name: "Delete",
        code: PermissionDesk.roleDelete,
      },
      {
        name: "Assign",
        code: PermissionDesk.roleAssign,
      },
    ],
  },
  {
    name: "Investor",
    permissions: [
      {
        name: "Read",
        code: PermissionDesk.investorRead,
      },
      {
        name: "Create",
        code: PermissionDesk.investorCreate,
      },
      {
        name: "Update",
        code: PermissionDesk.investorUpdate,
      },
      {
        name: "Delete",
        code: PermissionDesk.investorDelete,
      },
      {
        name: "Disable",
        code: PermissionDesk.investorDisable,
      },
    ],
  },
  {
    name: "Investor account",
    permissions: [
      {
        name: "Read",
        code: PermissionDesk.accountRead,
      },
      {
        name: "Create",
        code: PermissionDesk.accountCreate,
      },
      {
        name: "Delete",
        code: PermissionDesk.accountDelete,
      },
    ],
  },
  {
    name: "Make a request for ...",
    permissions: [
      {
        name: "Trade",
        code: PermissionDesk.requestTrade,
      },
      {
        name: "Fund",
        code: PermissionDesk.requestFund,
      },
      {
        name: "Refund",
        code: PermissionDesk.requestRefund,
      },
      {
        name: "Assets move",
        code: PermissionDesk.requestMove,
      },
    ],
  },
  {
    name: "Validate request for ...",
    permissions: [
      {
        name: "Trade",
        code: PermissionDesk.validateTrade,
      },
      {
        name: "Fund",
        code: PermissionDesk.validateFund,
      },
      {
        name: "Refund",
        code: PermissionDesk.validateRefund,
      },
      {
        name: "Assets move",
        code: PermissionDesk.validateMove,
      },
    ],
  },
];

export const PermissionAny = [
  ...Object.values(PermissionClearer),
  ...Object.values(PermissionOrganization),
  ...Object.values(PermissionDesk),
] as const;

export type PermissionClearer =
  typeof PermissionClearer[keyof typeof PermissionClearer];
export type PermissionOrganization =
  typeof PermissionOrganization[keyof typeof PermissionOrganization];
export type PermissionDesk = typeof PermissionDesk[keyof typeof PermissionDesk];
export type PermissionAny = typeof PermissionAny[number];
