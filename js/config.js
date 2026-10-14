// The ONLY place for payment and analytics settings. Nothing else in the site may hard-code these values.
window.NOBLE_CONFIG = {
  // 'sandbox' = test payments (no real money). 'live' = real payments.
  // To go live: set PAYPAL_ENV to 'live'. Client IDs are public. The secret never goes here.
  PAYPAL_ENV: 'live',
  PAYPAL_CLIENT_ID_SANDBOX: 'sb',
  PAYPAL_CLIENT_ID_LIVE: 'BAATHyWOzpdh0unmjeb7uu-84aM0mQWCr_65O14OLTVVSeBWqr9B1CuaN9Aa2b3AleP0Kb6oKt2NfWq-3M',

  PRICE: '5.00',          // one-time unlock price, no VAT charged (Section 19 UStG)
  CURRENCY: 'EUR',
  PRODUCT_NAME: 'FlossChart full unlock (all chart sizes, this browser)',

  FREE_MAX_STITCHES: 40,  // charts up to 40 x 40 stitches print free

  // Support contact shown to buyers. Empty = fall back to SUPPORT_URL.
  SUPPORT_EMAIL: 'support.toolkits.desk@gmail.com',
  SUPPORT_URL: 'https://github.com/mayo1-debug/noble-venture-04-private/issues',

  // Analytics. Abacus counters need no account. Empty ABACUS_NAMESPACE = off.
  ABACUS_NAMESPACE: 'flosschart-nv04',
  // Buttondown username for the newsletter sign-up form (noble/PING.md). Empty = the form is hidden.
  BUTTONDOWN_USERNAME: '',

  // Optional GoatCounter code (the part before .goatcounter.com). Empty = off.
  GOATCOUNTER_CODE: '',
  // Only these hostnames send analytics. Add the custom domain here after it is live.
  ANALYTICS_HOSTS: ['mayo1-debug.github.io', 'floss.toolkitsdesk.com'],
  // ?src=<channel> values that are counted as visit_src_<channel> (once per browser). Others are ignored.
  SRC_CHANNELS: ['seo', 'pinterest', 'youtube', 'etsy', 'newsletter', 'directory']
};
window.NOBLE_CONFIG.PAYPAL_CLIENT_ID = window.NOBLE_CONFIG.PAYPAL_ENV === 'live'
  ? window.NOBLE_CONFIG.PAYPAL_CLIENT_ID_LIVE
  : window.NOBLE_CONFIG.PAYPAL_CLIENT_ID_SANDBOX;
