// NOTE: This file is only used in dev environments and is excluded from builds.
//  An alternate version is generated by Terraform for Staging and Production environments.
window.APP_CONFIG = window.APP_CONFIG || {};
window.APP_CONFIG.apiURLForGOST = '/';

// For local development only. Register feature flags for Staging and Production by
//  configuring the `website_feature_flags` input variable in Terraform (see `terraform/*.tfvars`).
window.APP_CONFIG.featureFlags = {
  useNewTable: true,
};