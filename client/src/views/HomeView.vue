<template>
  <task-list />
</template>

<script>
  import TaskList from "../components/TaskList"

  export default {
    name: "HomeView",

    components: {
      TaskList,
    },
  }
</script>
