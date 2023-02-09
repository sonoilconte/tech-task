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
import Banner from '~/components/cms/Banner.vue'
import { extractComponents } from '@vue-storefront/storyblok'

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
    Banner,
  },
  computed: {
    components(): RenderContent[] {
      return extractComponents(this.content)
    },
  },
})
</script>
