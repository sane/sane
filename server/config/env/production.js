/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  // models: {
  //  connection: 'someMysqlServer'
  //  migrate: 'safe';
  // },

  /***************************************************************************
   * Uncomment to set the CORS Setting for your App in the production        *
   * environment (see config/cors.js )                                       *
   ***************************************************************************/

  //Uncomment this if you want CORS deactivated for production
  //cors: {
  //  allRoutes: false,
  //  origin: '*',
  //  credentials: false,
  //  methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
  //  headers: false
  //},
  
  //Deactivate some default routes for production, for security reasons
  blueprints: {
    //Uncomment if you want to disable action routes
    //actions: false,
    shortcuts: false
  }

  /***************************************************************************
   * Set the port in the production environment to 80                        *
   ***************************************************************************/

  // port: 80,

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/

  // log: {
  //   level: "silent"
  // }

};
