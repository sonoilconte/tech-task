import Vue from 'vue';
import { addBasePath } from '@vue-storefront/core';

Vue.filter('addBasePathFilter', (value: string): string => {
  return addBasePath(value);
});
