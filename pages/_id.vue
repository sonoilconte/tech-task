<template>
  <render-content :content="content" />
</template>

<script>
import Vue from 'vue';
import { onSSR } from '@vue-storefront/core';
import { computed, onMounted } from '@vue/composition-api';
import { useContent, storyblokBridge } from '@vue-storefront/storyblok';
import RenderContent from '~/components/cms/RenderContent.vue';

// This component renders the RenderContent component which in turn renders the storyblok cms components

export default Vue.extend({
  name: 'CMSDynamicPage',
  components: {
    RenderContent,
  },
  setup() {
    const { search, content } = useContent('homepage');
    const story = computed(() => content.value);
    const { body } = story.value;
    onSSR(async () => {
      // Tell storyblok we don't want the cached data with cv param 
      await search({ url: `homepage?cv=${Math.floor(Date.now()/1000)}` })
    })
    onMounted(() => {
      storyblokBridge(story.value)
    })
    console.log({ body });
    return {
      content: body,
    }
  }
});
</script>
