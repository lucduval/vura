/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ai_agent from "../ai_agent.js";
import type * as bank_import from "../bank_import.js";
import type * as fraud from "../fraud.js";
import type * as fraud_actions from "../fraud_actions.js";
import type * as http from "../http.js";
import type * as payments from "../payments.js";
import type * as stitch from "../stitch.js";
import type * as xero from "../xero.js";
import type * as xero_actions from "../xero_actions.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ai_agent: typeof ai_agent;
  bank_import: typeof bank_import;
  fraud: typeof fraud;
  fraud_actions: typeof fraud_actions;
  http: typeof http;
  payments: typeof payments;
  stitch: typeof stitch;
  xero: typeof xero;
  xero_actions: typeof xero_actions;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
