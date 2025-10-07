module.exports = {
  apps: [
    {
      name: 'vip-next',
      script: 'npm',
      args: 'start',
      env: {
        NEXT_PUBLIC_API_URL: 'https://api.majehimaje.life',
        NEXT_PUBLIC_SITE_URL: 'https://vipmilfnut.com',
        NEXT_PUBLIC_SITE_NAME: 'VipMilfNut',
        NEXT_PUBLIC_SITE_DESCRIPTION: 'Premium Adult Entertainment Videos',
        NODE_ENV: 'production'
      }
    }
  ]
}
