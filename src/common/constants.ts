export const TEXT_LENGTH = {
  ACCOUNT: {
    EMAIL: {
      MIN: 8,
      MAX: 256,
    },
    PASSWORD: {
      MIN: 6,
      MAX: 128,
    },
  },
  WORK: {
    NAME: {
      MIN: 4,
      MAX: 64,
    },
  },
  PROFILE: {
    NAME: {
      MIN: 4,
      MAX: 64,
    },
    USERNAME: {
      MIN: 4,
      MAX: 64,
    },
  },
  FEATURE: {
    NAME: {
      MIN: 4,
      MAX: 64,
    },
  },
};

export const ENUM = {
  SUBSCRIPTION: {
    TYPE: {
      FREE: "FREE",
      BASIC: "BASIC",
      CORPORATE: "CORPORATE",
    },
    STATUS: {
      ACTIVE: "ACTIVE",
      INACTIVE: "INACTIVE",
      CANCELED: "CANCELED",
    },
  },
};

export const FIELD_LENGTH = {
  SELECT: {
    MAX: 256,
  },
};

export const REQUEST_LIMITS = {
  PAYLOAD: {
    KB32: 32768,
    KB64: 65536,
    KB128: 131072,
    KB512: 524288,
    MB1: 1048576,
    MB2: 2097152,
  },
};
