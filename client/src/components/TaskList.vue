<template>
  <v-main>
    <v-card max-width="40%" class="mx-auto my-12">
      <v-card-text>
        <v-container>
          <v-row v-for="(task, index) in taskList" :key="task + index">
            <v-container>
              <v-row align="center">
                <v-card-title> {{ task.title }}</v-card-title>
                <v-spacer></v-spacer>

                <v-btn
                  class="ma-1"
                  icon
                  color="blue"
                  @click="changeTask(task.id)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  class="ma-1"
                  icon
                  color="red"
                  @click="openDeleteTask(task.id)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-row>
              <v-row v-for="n in 2" :key="n">
                <v-checkbox
                  class="cursor-default"
                  v-if="task.subTaskList[n - 1]"
                  readonly
                  :ripple="false"
                  color="info"
                  v-model="task.performedList[n - 1]"
                  :label="task.subTaskList[n - 1]"
                ></v-checkbox>
              </v-row>
              <v-row v-if="task.subTaskList.length > 2" justify="center"
                >...</v-row
              >
            </v-container>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="ma-1" fab dark color="green" @click="addDialog = true">
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
    <task-menu
      v-if="menuDialog"
      :menuDialog="menuDialog"
      @closeMenuDialog="menuDialog = $event"
      :taskId="taskId"
    ></task-menu>
    <add-dialog
      v-if="addDialog"
      :addDialog="addDialog"
      @closeAddDialog="addDialog = $event"
    ></add-dialog>
    <del-dialog
      v-if="delDialog"
      :delDialog="delDialog"
      @closeDelDialog="delDialog = $event"
      :taskId="taskId"
      :action="action"
    ></del-dialog>
  </v-main>
</template>




<script>
import { mapGetters, mapActions } from "vuex";
import TaskMenu from "./TaskMenu.vue";
import AddDialog from "./AddDialog.vue";
import DelDialog from "./DelDialog.vue";

export default {
  name: "TaskList",
  components: {
    TaskMenu,
    AddDialog,
    DelDialog,
  },
  data: () => ({
    taskId: null,
    action: "",
    menuDialog: false,
    addDialog: false,
    delDialog: false,
  }),
  computed: {
    ...mapGetters({
      count: "taskList/count",
      taskList: "taskList/taskList",
    }),
  },
  methods: {
    ...mapActions({
      setLocalStorageList: "taskList/setLocalStorageList",
      fetchList: "taskList/fetchList",
    }),
    changeTask(task_id) {
      this.taskId = task_id;
      this.menuDialog = true;
    },
    openDeleteTask(task_id) {
      this.taskId = task_id;
      this.action = "удалить";
      this.delDialog = true;
    },
  },
  mounted() {
    if (!localStorage.getItem("taskList")) {
      this.fetchList();
    } else {
      this.setLocalStorageList(JSON.parse(localStorage.getItem("taskList")));
    }
  },
};
</script>

