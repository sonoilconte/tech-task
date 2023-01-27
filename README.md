<div align="center">
<img src="https://user-images.githubusercontent.com/1626923/137092657-fb398d20-b592-4661-a1f9-4135db0b61d5.png" height="80px"/>
</div>

# Vue Storefront Solution Engineer Candidate Assignment
This repository holds a fresh version of a Vue Storefront application. The goal of this assignment is to prepare a customized demo which could be presented to one of our potential customers. It should leverage Vue Storefront integrations with both commercetools and Storyblok. The **model website (MW)** can be reviewed [here](https://vsf-timberland-e9731d0a.europe-west1.gcp.storefrontcloud.io/). You can go for creating a 1:1 clone of it but feel free to surprise us with your own invention!

## Prerequisites
Before you start working with the assignment, make sure you've created user accounts on both [Storyblok](https://app.storyblok.com/#!/signup) and [commercetools](https://mc.europe-west1.gcp.commercetools.com/login/new) platforms.

## How-to
To start working with the assignment, create a fork of this repository. Feel free to work on the `main` branch or create a separate one - whatever is most convenient for you. The time cap for completing this assignment is **~72 hours**.

Throughout the assignment process, **we consider you a part of our team**. Therefore, do not hesitate to ask questions! Everything you'll encounter while completing the tasks will probably be pretty new for you. If you're struggling or need advice, feel free to contact us. We might not respond immediately (in the end, we're trying to simulate a real-life situation here :wink:) or give you complete answers to all of your questions (not to do all of the job for you!). We will, however, do our best to provide you with the minimum necessary guidance.

## Installing packages
Some of the packages included in the project are a part of our enterprise offering and kept in our private registry. In order to install them, you need to sign into our registry. You should have received your personal credentials in a private message. Use them as described in [this](https://docs.vuestorefront.io/v2/general/enterprise.html#how-to-get-access-to-vue-storefront-enterprise) part of the documentation.

## Importing CMS components
> To perform the next steps, you're going to need [Storyblok CLI](https://www.storyblok.com/docs/Guides/command-line-interface) installed on your machine.

Before we start creating a customized PoC for a potential customer, we need to prepare the Storyblok space. Our CMS integrations rely on a component contract. We have the same set of components on both ends of the chain. In a Vue Storefront project you can find them in the `./components/cms` directory, whereas in Storyblok they reside in the `Components` section.

On the Vue Storefront side the components are already there but your Storyblok space's `Components` section is empty. Your next step will be to use the Storyblok CLI to upload all components into your space. Install the CLI on your machine and sign in with the credentials of your Storyblok account created in the previous step. After that, you can use the `storyblok-components.json` file from this repository to create the necessary content model in your space according [this part](https://www.storyblok.com/docs/Guides/command-line-interface) of the Storyblook documentation.

## Todo: commercetools
> All of the necessary information on configuring the project in commercetools and adjusting Vue Storefront configuration accordingly can be found in our [documentation for commercetools integration](https://docs.vuestorefront.io/v2/commercetools/).

Initially, the assignment app is connected to our `vsf-generic-ent-demo` project in commercetools. You should sign into your commercetools account and create a brand new project there. After that, your task will be to:

- reconnect the assignment app to your newly-created project in commercetools
- configure currencies, languages and countries
- create zones
- create a basic product type
- create a tax category
- create a shipping method
- create a category tree. The newly created category tree should match the one you can see in the MW. The goal is to have a total of **2** main categories with **2** subcategories each. **Fields like name and slug ought to be localised**.
- add products. Every product should feature a name, a tax category and a slug. It should also feature a single variant (with unique SKU, an image and two price variants). **Fields like name and slug ought to be localised. Remember to include price variants for both currencies featured in the project**.
- adjust Vue Storefront configuration. To allow your Vue Storefront application to display languages and currencies from commercetools correctly, you will have to make some adjustments in configuration files (`nuxt.config.js` and `middleware.config.js`).

After you had completed all of the above steps, you should be able to:
- see the correct navigation links in the app header
- navigate to your PLP (Product Listing Pages aka Category pages) using the aforementioned links and see the products displayed correctly for both main categories and subcategories
- navigate to any PDP (Product Detail Page) and see your product details there
- go through a complete shopping flow (add some product to the cart, go through the checkout and place an order)

## Todo: Storyblok
> All of the necessary information on creating pages in Storyblok and configuring Vue Storefront so that it displays them correctly can be found in our [documentation for Storyblok integration](https://docs.vuestorefront.io/storyblok/).

> Since you've already imported all components into your Storyblok space, you can skip the majority of the [Content creation](https://docs.vuestorefront.io/storyblok/guide/content.html) part (except for the one about [setting up visual editor](https://docs.vuestorefront.io/storyblok/guide/content.html#last-but-not-least)).

> The only component you'll have to tweak on the Storyblok side is the `ProductSlider`. It is a special component allowing us to inject product data from our commercetools project into our content. By default, it is connected to our `vsf-generic-ent-demo` project. You need to reconnect it to your newly-created commercetools project. In order to do so, please, create a new API client in commercetools with Read-Only permissions.

Initially, the assignment app is not connected to any CMS. Your task in this part will be to:
- plug our Storyblok integration in, according to the instructions included in the documentation
- configure the [Storyblok Bridge](https://docs.vuestorefront.io/storyblok/guide/usage.html#real-time-visual-editor-storyblok-bridge). It is advised to do this one at the very beginning since it will help you to build your homepage later on. However, if - for some reason - you're struggling with it - feel free to skip that step and leave it for the very end
- connect the `ProductSlider` component to a Read-Only API client of your newly-created commercetools project
- (**CRUCIAL**) prepare the `_id.vue` component for displaying dynamic CMS content
- (**CRUCIAL**) in Storyblok, create a new story which will be our new homepage in the assignment app. Feel free to build a clone of the `/home-page` from the MW. The story should include the following components structure:
    - Hero
    - Heading
    - ProductSlider
    - Banner
    - CallToAction
    - StyleGuide (optional): this component can help you to alter some styles on the page (i.e. colors of the buttons). Using it is welcomed but not mandatory. 
- make sure the newly-created homepage can be displayed on the `/homepage` route. Add a redirect from `/` onto `/homepage` so that the new homepage replaces the default one

After you had completed all of the above steps, you should be able to:
- use the [Visual Editor](https://www.storyblok.com/docs/guide/essentials/visual-editor) while editing content in Storyblok
- display a page built with Storyblok on the `/homepage` route

## Todo: Look & Feel
While delivering demos to our customers, filling commercetools with their products and creating content in the CMS is only 2/3 of the work. Apart from that, we need to improve the general look & feel of the application to resemble our customer's branding and give him a truly customized experience. That includes:
- adjusting the colors of the top bar and buttons
- replacing the default Vue Storefront logo with our customer's brand logo
- replacing favicon
- replacing head's title

The first and straightforward way of doing this would be adjusting the corresponding scss variables and style rules in Vue components. However, it could also be done leveraging the Storyblok `StyleGuide` component. You could connect any style to it and set values for the scss rules and variables from inside Storyblok.

The latter option (with the StyleGuide) would be the preferred one but is not mandatory. All we care about here is that custom look & feel of the new demo - regardless of the path you choose to achieve that.

## A word about internationalization
In Vue Storefront demos, we place a huge emphasis on the simplicity of displaying content in different languages. Just like the MW, your assignment application should have two language versions: English and Spanish. That will require to add content for these locales in both commercetools and Storyblok.

Having said that, it is not mandatory to provide 100% coverage in the translations. You could even focus on the proper English content only and use some dummy text as Spanish translations. The end result we expect to see is at least a slight change in content - of both Storyblok components and products from commercetools - after using the language switch in the top right corner of the page.

## Code review checklist (✓/✗)

**VSF + commercetools:**

- [] Connected a new commercetools project to Vue Storefront
- [] Created a category tree and displayed category links in the application's header
- [] Added products and displayed them on Product Listing Pages
- [] Ensured one can switch application's language and see localised product data
- [] Ensured one can add a product to the cart
- [] Ensured one can choose a shipping method during checkout

**VSF + Storyblok:**

- [] Created a trial space
- [] Prepared the space by importing components from JSON schema
- [] Configured Storyblok Bridge
- [] Connected the Product Slider component to a Read-Only API Client of commercetools trial project
- [] Built a custom homepage by adding a new story and using existing components provided by VSF
- [] Added integration configuration on the Vue Storefront side
- [] Prepared the `_id.vue` component for displaying dynamic CMS content
- [] Added a redirect onto the new homepage route
- [] Customised the look & feel
- [] Added Storyblok content localisation

**Good luck!**
