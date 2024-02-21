export const AUTH_TOKEN_NAME = 'X_GARI_CHAI_TOKEN';
export const API_DOMAIN = 'gari-chai.onrender.com';

export const SALT_ROUNDS = 10;
export const TEN_MINUTES_IN_MS = 10 * 60 * 1000;

// QUERY PARAMS
export const SORT_FIELD_SEPARATOR = ':';

// CAR MODEL KEY VALUE & POPULATE PATH

export const CAR_MODEL_NAME_KEY = 'name';
export const CAR_MODEL_LAUNCHED_AT_KEY = 'launchedAt';

export const CAR_MODEL_BRAND_PATH = 'brand.value';
export const CAR_MODEL_BRAND_MODEL_PATH = 'brandModel.value';
export const CAR_MODEL_TAGS_PATH = 'tags.value';
export const CAR_MODEL_VENDOR_PATH = 'vendor.value';
export const CAR_MODEL_BODY_STYLE_PATH = 'bodyStyle.value';

export const CAR_MODEL_BRAND_LABEL_PATH = 'brand.label';
export const CAR_MODEL_BRAND_MODEL_LABEL_PATH = 'brandModel.label';
export const CAR_MODEL_BODY_STYLE_LABEL_PATH = 'bodyStyle.label';

export const CAR_CAMPAIGN_POPULATE_NEW_CARS = 'newCars.car';
export const CAR_CAMPAIGN_POPULATE_USED_CARS = 'usedCars.car';

// COMMENT POPULATE PATH
export const POPULATE_USER_BASIC_INFO = 'firstName lastName profilePicture';

// passport config
export const LOCAL_PHONE_FIELD = 'local.phone';
export const LOCAL_EMAIL_FIELD = 'local.email';

// Discriminators
export const CAR_CAMPAIGN = 'CarCampaign';
