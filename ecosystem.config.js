module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'API',
      script    : 'app.js',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'production'
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : 'rmeier',
      host : '100.127.254.3',
      ref  : 'origin/master',
      repo : 'https://github.com/RenatiusvanSander/api.git',
      path : '/var/node/inventory-api/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      env : {
        NODE_ENV : 'production'
      }
    }
  }
};
