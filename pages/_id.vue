<template>
  <render-content v-if="locale === 'es-es'" :content="esStoryBody" />
  <render-content v-else :content="enStoryBody" />
</template>

<script>

import Vue from 'vue';
import { onSSR } from '@vue-storefront/core'
import { computed, onMounted } from '@vue/composition-api';
import { useContent, storyblokBridge } from '@vue-storefront/storyblok';
import RenderContent from '~/components/cms/RenderContent.vue';

export default Vue.extend({
    name: 'CMSDynamicPage',
    components: {
        RenderContent,
    },
    data() {
        let locale = 'en-us';
        if (process.client) {
            locale = window.location.pathname.replace('/', '').toLowerCase();
        }
        console.log({ locale });
        return {
            locale,
        }
    },
    setup() {
        const { search, content } = useContent('enContent');
        const story = computed(() => content.value);
        const enStoryBody = story.value.body

        const esContentResult = useContent('esContent');
        const esContent = esContentResult.content;
        const esSearch = esContentResult.search;
        const esStory = computed(() => esContent.value);
        const esStoryBody = esStory.value.body;

        onSSR(async() => {
            await search({ url: 'home-page', cache: false, locale: 'default' });
            await esSearch({ url: 'home-page', cache: false, locale: 'es-es' })
        });

        onMounted(() => {
            storyblokBridge(story.value);
        })

        console.log({ enStoryBody, esStoryBody })
        
        return {
            enStoryBody,
            esStoryBody 
        };
    }
}); 


// export default Vue.extend({
//   name: 'CMSDynamicPage',
//   components: {
//     RenderContent,
//   },
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
//   setup() {
    
//     // For English content
//     let { search, content } = useContent('enContent');
//     let story = computed(() => content.value);
//     const enBody = story.value.body;
    
//     // For Spanish content
//     // const useEsContent = useContent('esContent');
//     // const esSearch = useEsContent.search;
//     // const esContent = useEsContent.content;
//     // const esStory = computed(() => esContent.value); 
//     // const esBody = esStory.value.body;

//     onSSR(async () => {
//       await search({ url: 'home-page', locale: '', cache: false });
//     //   await esSearch({ url: 'homepage', locale: 'es', cache: false });
//     });

//     // onMounted(async () => {
//     //   storyblokBridge(story.value)
//     // });

//     console.log({ 
//       enBody,
//     //   esBody, 
//     });

//     return {
//       en: enBody,
//     //   es: esBody,
//     };
//   }
// });



</script>