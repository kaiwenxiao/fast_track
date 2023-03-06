/* eslint-disable */

import Vue from 'vue';
import VueI18n from 'vue-i18n';
import enUS from './en-US';
import esES from './es-ES';
import ruRU from './ru-RU';
import ptPT from './pt-PT';
import bsBA from './bs-BA';
import srSP from './sr-SP';
import elGR from './el-GR';
import frFR from './fr-FR';
import hrHR from './hr-HR';
import nlNL from './nl-NL';
import srME from './sr-ME';
import siSI from './si-SI';

Vue.use(VueI18n)
new VueI18n({
  locale: 'en-US',
  messages: {
    'en-US': enUS,
    'es-ES': esES,
    'ru-RU': ruRU,
    'pt-PT': ptPT,
    'bs-BA': bsBA,
    'sr-SP': srSP,
    'el-GR': elGR,
    'fr-FR': frFR,
    'hr-HR': hrHR,
    'nl-NL': nlNL,
    'sr-ME': srME,
    'si-SI': siSI,
  },
  fallbackLocale: 'en-US',
  silentFallbackWarn: true,
});

export default VueI18n;
