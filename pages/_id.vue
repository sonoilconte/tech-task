<template>
  <render-content :content="en" />
</template>

<script>

import Vue from 'vue';
import { onSSR } from '@vue-storefront/core'
import { computed, onMounted } from '@vue/composition-api';
import { useContent, storyblokBridge } from '@vue-storefront/storyblok';
import RenderContent from '~/components/cms/RenderContent.vue';

// export default Vue.extend({
//     name: 'CMSDynamicPage',
//     components: {
//         RenderContent,
//     },
//     setup() {
//         const { search, content, loading, error } = useContent('enContent');

//         const story = computed(() => content.value);
//         const enContent = story.body

//         onSSR(async() => {
//             await search({ url: 'home-page' });
//         });

//         onMounted(() => {
//             storyblokBridge(story.value);
//         })

//         console.log({ content })
//         return {
//             content: enContent, 
//             loading,
//             error,
//         };
//     }
// }); 


export default Vue.extend({
  name: 'CMSDynamicPage',
  components: {
    RenderContent,
  },
//   head() {
//     return {
//       title: 'Hammer Menswear',
//     }
//   },
//   data() {
//     let locale = '';
//     if (process.client) {
//       locale = window.location.pathname.replace('/', '');
//     }
//     return {
//       locale, 
//     }
//   },
  setup() {
    
    // For English content
    let { search, content } = useContent('enContent');
    let story = computed(() => content.value);
    const enBody = story.value.body;
    
    // For Spanish content
    // const useEsContent = useContent('esContent');
    // const esSearch = useEsContent.search;
    // const esContent = useEsContent.content;
    // const esStory = computed(() => esContent.value); 
    // const esBody = esStory.value.body;

    onSSR(async () => {
      await search({ url: 'home-page', locale: '', cache: false });
    //   await esSearch({ url: 'homepage', locale: 'es', cache: false });
    });

    // onMounted(async () => {
    //   storyblokBridge(story.value)
    // });

    console.log({ 
      enBody,
    //   esBody, 
    });

    return {
      en: enBody,
    //   es: esBody,
    };
  }
});



</script>