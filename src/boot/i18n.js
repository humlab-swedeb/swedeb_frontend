import { boot } from 'quasar/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

  const i18n = createI18n({
    legacy: false,
    locale: 'sv',
    globalInjection: true,
    //warnHtmlMessage: false, //supress warning about html in i18n content
    messages,

  });

export default boot(({ app }) => {


  // Set i18n instance on app
  app.use(i18n)
})

export { i18n };
