'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {
    console.log('=== STRAPI STARTING ===');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('DATABASE_CLIENT:', process.env.DATABASE_CLIENT);
    console.log('DATABASE_URL set:', !!process.env.DATABASE_URL);
    console.log('STRIPE_SECRET_KEY set:', !!process.env.STRIPE_SECRET_KEY);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};
