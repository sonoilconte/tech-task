<template>
  <div v-editable="content || ''">
    <component
      v-for="(component, index) in components"
      v-editable="content[index] ? content[index] : ''"
      :is="component.componentName"
      :key="index"
      v-bind="component.props"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { extractComponents } from '@vue-storefront/storyblok'

import Hero from '~/components/cms/Hero.vue'
import Heading from '~/components/cms/Heading.vue'
import ProductSlider from '~/components/cms/ProductSlider.vue'
import Banner from '~/components/cms/Banner.vue'
import CallToAction from '~/components/cms/CallToAction.vue'
import StyleGuide from '~/components/cms/StyleGuide.vue'


interface RenderContent {
  componentName: string
  props?: {}
}

export default Vue.extend({
  name: 'RenderContent',
  props: {
    content: {
      type: Array,
    },
  },
  components: {
    Hero, 
    Heading,
    ProductSlider,
    Banner,
    CallToAction,
    StyleGuide,
  },
  computed: {
    components(): RenderContent[] {
      return extractComponents(this.content)
    },
  },
})
</script>
