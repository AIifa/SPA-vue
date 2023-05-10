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

                <v-btn class="ma-1" icon color="blue" @click="changeTask(task.id)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn class="ma-1" icon color="red" @click="openDeleteTask(task.id)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-row>

              <v-row v-for="ind in hideShowSubtasks[index]" :key="ind + task.id">
                <v-checkbox class="cursor-default" v-if="task.subTaskList[ind - 1]" readonly :ripple="false" color="info"
                  v-model="task.performedList[ind - 1]" :label="task.subTaskList[ind - 1]"></v-checkbox>
              </v-row>

              <v-row v-if="task.subTaskList.length > 2 && hideShowSubtasks[index] == 2" justify="center"
                @click="hideShowListBtn(index, true)">
                <v-icon>mdi-arrow-down</v-icon>
              </v-row>
              <v-row v-else-if="task.subTaskList.length > 2" justify="center" @click="hideShowListBtn(index, false)">
                <v-icon>mdi-arrow-up</v-icon>
              </v-row>

            </v-container>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="ma-1" fab dark color="green" @click="addNewTask()">
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
    <task-menu v-if="menuDialog" :menuDialog="menuDialog" @closeMenuDialog="menuDialog = $event" :taskId="taskId"
      @popListHideShow="popListHideShow(taskId)"></task-menu>
    <add-dialog v-if="addDialog" :addDialog="addDialog" @closeAddDialog="addDialog = $event"
      @pushListHideShow="pushListHideShow()"></add-dialog>
    <del-dialog v-if="delDialog" :delDialog="delDialog" @closeDelDialog="delDialog = $event" :taskId="taskId"
      :action="action" @popListHideShow="popListHideShow(taskId)"></del-dialog>
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
    listHideShowSubtasks: [],
  }),
  computed: {
    ...mapGetters({
      count: "taskList/count",
      taskList: "taskList/taskList",
    }),
    hideShowSubtasks() {
      return this.listHideShowSubtasks
    }
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
    addNewTask() {
      this.addDialog = true
    },
    hideShowListBtn(index, show) {
      if (show)
        this.listHideShowSubtasks.splice(index, 1, this.taskList[index].subTaskList.length)
      else
        this.listHideShowSubtasks.splice(index, 1, 2)
    },
    popListHideShow(id) {
      this.listHideShowSubtasks.splice(this.taskList.map((el) => el.id).indexOf(id), 1)
    },
    pushListHideShow() {
      this.listHideShowSubtasks.push(2);
    }
  },
  mounted() {
    if (!localStorage.getItem("taskList")) {
      this.fetchList().then(response => {
        for (let i = 0; i < response; i++) {
          this.listHideShowSubtasks.splice(i, 0, 2)
        }
      })
    } else {
      this.setLocalStorageList(JSON.parse(localStorage.getItem("taskList")));
      for (let i = 0; i < this.taskList.length; i++) {
        this.listHideShowSubtasks.splice(i, 0, 2)
      }
    }
  },
};
</script>

