<template>
  <v-app>
    <header_part></header_part>
    <content_part></content_part>
    <footer_part></footer_part>
  </v-app>
</template>

<script>
    import header_part from './components/header_part'
    import content_part from './components/content_part'
    import footer_part from './components/footer_part'
    export default {
        name: 'App',
        components: {
        header_part,
        content_part,
        footer_part
    },
    data () {
      return {
      //
      }
    }
}
</script>
