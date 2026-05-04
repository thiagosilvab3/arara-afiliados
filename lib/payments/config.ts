import "server-only";

import { getServerEnv } from "../env";

export type PaymentProvider = "custom";

export function getPaymentsConfig() {
  const env = getServerEnv();

  return {
    enabled: env.PAYMENTS_ENABLED,
    provider: env.PAYMENTS_PROVIDER as PaymentProvider,
    webhookToken: env.PAYMENTS_WEBHOOK_TOKEN
  };
}

export function paymentsAreEnabled() {
  return getPaymentsConfig().enabled;
}