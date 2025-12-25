<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  status: string;
}>()

const status = ref(props.status)

if (props.status === 'AC') {
  status.value = 'Accepted'
} else if (props.status === 'WA') {
  status.value = 'Wrong Answer'
}
</script>

<template>
  <span w-min rounded-full p-y-1 p-x-2 bg-gray-2 rounded="full" :class="{
    'bg-green-2 text-green-6': status === 'Accepted',
    'bg-red-2 text-red-6': status === 'Wrong Answer',
    'bg-blue-2 text-blue-6': status === 'Time Out',
    'bg-lime-2 text-lime-6': status === 'Compile Error',
    'bg-amber-2 text-amber-6': status === 'Empty Output',
  }">{{
    status
    }}</span>
</template>
