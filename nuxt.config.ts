// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  app: {
    head: {
      link: [{ rel: 'stylesheet', href: 'https://www.w3schools.com/w3css/4/w3.css' }],
      meta: [{ name:"viewport", content:"width=device-width, user-scalable=no" }]
    }
  },
  ssr: false
})
