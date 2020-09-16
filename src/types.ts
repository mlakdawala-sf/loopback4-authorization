import {Request} from '@loopback/rest';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import PostgresAdapter from 'casbin-pg-adapter';

/**
 * Authorize action method interface
 */
export interface AuthorizeFn {
  // userPermissions - Array of permission keys granted to the user
  // This is actually a union of permissions picked up based on role
  // attached to the user and allowed permissions at specific user level
  (userPermissions: string[], request?: Request): Promise<boolean>;
}

/**
 * Casbin authorize action method interface
 */
export interface CasbinAuthorizeFn {
  // user - User object corresponding to the logged in user
  // resVal - value of the resource for which authorisation is being sought
  (user: IAuthUserWithPermissions, resVal: string): Promise<boolean>;
}
/**
 * Authorization metadata interface for the method decorator
 */
export interface AuthorizationMetadata {
  // Array of permissions required at the method level.
  // User need to have at least one of these to access the API method.
  permissions: string[];

  // Name of resource for which authorisation is being sought
  resource?: string;

  /**
   * Boolean flag to determine whether we are using casbin policy format or not
   * isCasbinPolicy = true, when we are providing casbin format policy doc in application
   * isCasbinPolicy = false, when we are impplementing provider in app to give casbin policy
   */
  isCasbinPolicy?: boolean;
}

/**
 * Authorization config type for providing config to the component
 */
export interface AuthorizationConfig {
  /**
   * Specify paths to always allow. No permissions check needed.
   */
  allowAlwaysPaths: string[];
}

/**
 * Permissions interface to be implemented by models
 */
export interface Permissions<T> {
  permissions: T[];
}

/**
 * Override permissions at user level
 */
export interface UserPermissionsOverride<T> {
  permissions: UserPermission<T>[];
}

/**
 * User Permission model
 * used for explicit allow/deny any permission at user level
 */
export interface UserPermission<T> {
  permission: T;
  allowed: boolean;
}

/**
 * User permissions manipulation method interface.
 *
 * This is where we can add our business logic to read and
 * union permissions associated to user via role with
 * those associated directly to the user.
 *
 */
export interface UserPermissionsFn<T> {
  (userPermissions: UserPermission<T>[], rolePermissions: T[]): T[];
}

/**
 * Casbin enforcer getter method interface
 *
 * This method provides the Casbin config
 * required to initialise a Casbin enforcer
 */
export interface CasbinEnforcerConfigGetterFn {
  (
    authUser: IAuthUserWithPermissions,
    resource: string,
    isCasbinPolicy?: boolean,
  ): Promise<CasbinConfig>;
}

/**
 * Casbin resource value modifier method interface
 *
 * This method can help modify the resource value
 * for integration with casbin, as per business logic
 */
export interface CasbinResourceModifierFn {
  (pathParams: string[]): Promise<string>;
}

/**
 * Casbin config object
 */
export interface CasbinConfig {
  model: string;
  policy?: string | PostgresAdapter;
  allowedRes?: string[];
}
