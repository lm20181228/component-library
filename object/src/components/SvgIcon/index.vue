<template>
  <component class="svg-icon" :is="iconClass" :width="svgWidth" :height="svgHeight"></component>
</template>

<script>
export default {
  name: 'svgIcon',
  props: {
    iconClass: {
      type: String,
      required: true,
    },
    svgWidth: {
      type: [Number, String],
      default: 16,
    },
    svgHeight: {
      type: [Number, String],
      default: 16,
    },
  },
};
</script>
<style scoped>
.svg-icon {
  /* width: 1em;
  height: 1em; */
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
