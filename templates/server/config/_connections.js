/**
 * Connections
 * (sails.config.connections)
 *
 * `Connections` are like "saved settings" for your adapters.  What's the difference between
 * a connection and an adapter, you might ask?  An adapter (e.g. `sails-mysql`) is generic--
 * it needs some additional information to work (e.g. your database host, password, user, etc.)
 * A `connection` is that additional information.
 *
 * Each model must have a `connection` property (a string) which is references the name of one
 * of these connections.  If it doesn't, the default `connection` configured in `config/models.js`
 * will be applied.  Of course, a connection can (and usually is) shared by multiple models.
 * .
 * Note: If you're using version control, you should put your passwords/api keys
 * in `config/local.js`, environment variables, or use another strategy.
 * (this is to prevent you inadvertently sensitive credentials up to your repository.)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.connections.html
 */

module.exports.connections = {

  /***************************************************************************
  *                                                                          *
  * Local disk storage for DEVELOPMENT ONLY                                  *
  *                                                                          *
  * Installed by default.                                                    *
  *                                                                          *
  ***************************************************************************/
  disk: {
    adapter: 'sails-disk'
  },

  /***************************************************************************
  *                                                                          *
  * MySQL is the world's most popular relational database.                   *
  * http://en.wikipedia.org/wiki/MySQL                                       *
  *                                                                          *
  * Run: npm install sails-mysql                                             *
  *                                                                          *
  ***************************************************************************/

  //docker host uses db, otherwise use localhost or the IP of your db
  //credentials for docker are defined in the fig.yml
  //otherwise dependent on your setup
  mysql: {
    adapter: 'sails-mysql',
    host: '{{host}}',
    user: 'root',
    password: 'password',
    database: 'sane'
  },

  /***************************************************************************
  *                                                                          *
  * MongoDB is the leading NoSQL database.                                   *
  * http://en.wikipedia.org/wiki/MongoDB                                     *
  *                                                                          *
  * Run: npm install sails-mongo                                             *
  *                                                                          *
  ***************************************************************************/

  //docker host uses db, otherwise use localhost or the IP of your db
  //credentials for docker are defined in the fig.yml
  //otherwise dependent on your setup
  mongo: {
    adapter: 'sails-mongo',
    host: '{{host}}',
    port: 27017,
    // user: 'username',
    // password: 'password',
    // database: 'your_mongo_db_name_here'
  },

  /***************************************************************************
  *                                                                          *
  * PostgreSQL is another officially supported relational database.          *
  * http://en.wikipedia.org/wiki/PostgreSQL                                  *
  *                                                                          *
  * Run: npm install sails-postgresql                                        *
  *                                                                          *
  ***************************************************************************/

  //docker host uses db, otherwise use localhost or the IP of your db
  //credentials for docker are defined in the fig.yml
  //otherwise dependent on your setup
  postgresql: {
    adapter: 'sails-postgresql',
    host: '{{host}}',
    user: 'postgres',
    password: '',
    database: 'postgres'
  },

  /***************************************************************************
  *                                                                          *
  * Redis is an open source, BSD licensed, advanced key-value cache and      *
  * store.                                                                   *
  *                                                                          *
  * http://en.wikipedia.org/wiki/Redis                                       *
  *                                                                          *
  * Run: npm install sails-redis                                             *
  *                                                                          *
  ***************************************************************************/

  redis: {
    adapter: 'sails-redis',
    port: 6379,
    host: '{{host}}',
    database: null
  }

  /***************************************************************************
  *                                                                          *
  * More adapters: https://github.com/balderdashy/sails                      *
  *                                                                          *
  ***************************************************************************/

};
