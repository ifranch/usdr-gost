// NOTE: This file is only used in dev environments and is excluded from builds.
//  An alternate version is generated by Terraform for Staging and Production environments.
window.APP_CONFIG = window.APP_CONFIG || {};
window.APP_CONFIG.apiURLForGOST = '/';
window.APP_CONFIG.overrideFeatureFlag = (flagName, overrideValue) => {
  const storageKey = 'featureFlags';
  let overrides = {};
  try {
    overrides = JSON.parse(window.sessionStorage.getItem(storageKey)) || {};
  } catch (e) {
    console.error(`Error parsing window.sessionStorage.${storageKey} as JSON:`, e);
    console.warn(`window.sessionStorage.${storageKey} will be replaced.`);
  }
  overrides[flagName] = overrideValue;
  window.sessionStorage.setItem(storageKey, JSON.stringify(overrides));
  console.log('New feature flag overrides in page session:',
    window.sessionStorage.getItem(storageKey));
};

// For local development only. Register feature flags for Staging and Production by
//  configuring the `website_feature_flags` input variable in Terraform (see `terraform/*.tfvars`).
window.APP_CONFIG.featureFlags = {
  useNewTable: true,
  myProfileEnabled: true
};
