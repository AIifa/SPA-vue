<template>
  <v-row justify="center">
    <v-dialog v-model="addDialog" persistent max-width="370">
      <v-card>
        <v-card-title class="text-h5"> Введите название задания </v-card-title>
        <v-text-field
          class="ma-2"
          label="Введите название"
          v-model="taskName"
        ></v-text-field>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="saveTask"> Сохранить </v-btn>
          <v-btn color="error" text @click="$emit('closeAddDialog', false)">
            Отмена
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "AddDialog",
  props: {
    addDialog: Boolean,
  },
  data: () => ({
    taskName: "New Task",
  }),
  methods: {
    ...mapActions({
      addNewTask: "taskList/addNewTask",
    }),
    saveTask() {
      this.addNewTask(this.taskName);

      this.$emit("closeAddDialog", false);
    },
  },
};
</script>