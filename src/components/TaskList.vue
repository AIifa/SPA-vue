<template>
  <v-main>
    <v-card max-width="40%" class="mx-auto my-12">
      <v-card-text>
        <v-container>
          <v-row v-for="(task, index) in taskList" :key="index">
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
                  class="curDef"
                  v-if="task.subTaskList[n - 1]"
                  readonly
                  :ripple="false"
                  color="info"
                  v-model="task.performedList[n - 1]"
                  :label="`${task.subTaskList[n - 1]}`"
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
        <v-btn class="ma-1" fab dark color="green" @click="createNewTask()">
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
    <task-menu v-if="dialog" :taskId="taskId"></task-menu>
    <add-dialog v-if="addDialog"></add-dialog>
    <del-dialog v-if="delDialog" :taskId="taskId" :action="action"></del-dialog>
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
  }),
  computed: {
    ...mapGetters({
      dialog: "menu/dialog",
      addDialog: "addMenu/dialog",
      delDialog: "delMenu/dialog",
      count: "taskList/count",
      taskList: "taskList/taskList",
      url: "taskList/url",
    }),
  },
  methods: {
    ...mapActions({
      changeDialog: "menu/changeDialog",
      changeDelDialog: "delMenu/changeDialog",
      changeAddDialog: "addMenu/changeDialog",
      setLocalStorageList: "taskList/setLocalStorageList",
      fetchList: "taskList/fetchList",
    }),

    createNewTask() {
      this.changeAddDialog(true);
    },
    changeTask(task_id) {
      this.taskId = task_id;
      console.log("Vue/TaskList/changeTask/task_id " + this.taskId);
      this.changeDialog(true);
    },
    openDeleteTask(task_id) {
      this.taskId = task_id;
      console.log("Vue/TaskList/openDeleteTask/task_id " + this.taskId);
      this.action = "удалить";
      this.changeDelDialog(true);
    },
  },
  mounted() {
    if (!localStorage.getItem("taskList")) {
      fetch(this.url)
        .then((response) => response.json())
        .then((data) => this.fetchList(data));

      // localStorage.setItem("taskList", JSON.stringify(this.taskList));
      // localStorage.setItem("count", this.count);
      // console.log("Set local storage data");
    } else {
      this.setLocalStorageList(JSON.parse(localStorage.getItem("taskList")));
      console.log("Get local storage data");
    }

    console.log("Vue/TaskList/mounted/taskList " + this.taskList);
  },
  updated() {},
};
</script>

