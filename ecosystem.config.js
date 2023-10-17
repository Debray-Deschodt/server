module.exports = {
  apps : [{
    name: "Uchronie",
    script: "./bin/www",
    mode: "cluster",
    autorestart: true,
    watch: true,
    instances: "1" ,
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }, 
//   {
//     name: "worker",
//     script: "./bin/www"
//   }
]}


// module.exports = {
//   apps : [{
//     script: './bin/www',
//     watch: '.'
//   }, 
//   // {
//   //   script: './service-worker/',
//   //   watch: ['./service-worker']
//   // }
// ],

//   // deploy : {
//   //   production : {
//   //     user : 'SSH_USERNAME',
//   //     host : 'SSH_HOSTMACHINE',
//   //     ref  : 'origin/master',
//   //     repo : 'GIT_REPOSITORY',
//   //     path : 'DESTINATION_PATH',
//   //     'pre-deploy-local': '',
//   //     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
//   //     'pre-setup': ''
//   //   }
//   // }
// };
