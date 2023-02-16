<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="370">
      <v-card>
        <v-card-title class="text-h5"> Введите название задания </v-card-title>
        <v-text-field
          class="ma-2"
          label="Введите название"
          v-model="taskName"
        ></v-text-field>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="saveTask()"> Сохранить </v-btn>
          <v-btn color="error" text @click="changeDialog(false)">
            Отмена
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "AddDialog",

  data: () => ({
    taskName: "New Task",
  }),
  computed: {
    ...mapGetters({
      dialog: "addMenu/dialog",
    }),
  },
  methods: {
    ...mapActions({
      changeDialog: "addMenu/changeDialog",
      addNewTask: "taskList/addNewTask",
    }),
    saveTask() {
      this.addNewTask(this.taskName);
      this.changeDialog(false);
    },
  },
};
</script>