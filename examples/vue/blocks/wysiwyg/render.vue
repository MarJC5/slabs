<template>
  <div class="paragraph-block">
    <div v-if="text" v-html="text"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getField } from '@slabs/helpers';
import './style.css';

interface Props {
  data: any;
  context?: any;
}

const props = defineProps<Props>();

const text = computed(() => getField<string>(props.data, 'text'));
</script>
