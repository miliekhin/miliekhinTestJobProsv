<script setup lang='ts'>
  interface Props {
    monthName: string,
  }
  const props = withDefaults(defineProps<Props>(), {
    monthName: 'Месяц',
  });
  defineEmits(['prev-month', 'next-month']);
</script>

<template>
  <div class="switch-wrap">
    <span
        class="arrow"
        @click="$emit('prev-month')"
    >
      &#10094;
    </span>
    <span class="month-name"> {{ monthName }} </span>
    <span
        class="arrow"
        @click="$emit('next-month')"
    >
      &#10095;
    </span>
  </div>
</template>

<style scoped>
  .switch-wrap{
    display: flex;
    align-items: center;
    color: dodgerblue;
    margin-bottom: 15px;
  }
  .month-name{
    width: 200px;
    text-align: center;
  }
  .arrow{
    cursor: pointer;
    user-select: none;
  }
</style>