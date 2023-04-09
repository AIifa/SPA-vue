<template>
  <v-row justify="center" v-if="dialog">
    <v-dialog v-model="dialog" persistent scrollable max-width="660px">
      <v-card height="80vh">
        <v-card-title>
          <v-btn
            class="mx-1"
            icon
            :disabled="undoStackAction.length <= 0"
            color="black"
            @click="undo()"
          >
            <v-icon dark>mdi-arrow-left</v-icon>
          </v-btn>

          <v-btn
            class="mr-4"
            icon
            :disabled="redoStackAction.length <= 0"
            color="black"
            @click="redo()"
          >
            <v-icon dark>mdi-arrow-right</v-icon>
          </v-btn>

          <span class="text-h5">Редактирование задания</span>
        </v-card-title>

        <!--<v-container>-->
        <v-card-title class="py-0">
          <v-row>
            <v-text-field
              style="align-items: baseline;"
              v-model="copyTask.title"
              flat
              solo
              class="text-h6"
            >
              <template v-slot:append-outer>
                <v-btn icon color="error" @click="openDeleteTask(taskId)">
                  <v-icon dark>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-row>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <!--Tasks-->
          <v-row
            v-for="(task, index) in copyTask.subTaskList"
            :key="index"
            align="start"
          >
            <v-col cols="1">
              <v-checkbox
                hide-details
                color="info"
                @change="pushBtn(index)"
                v-model="copyTask.performedList[index]"
              ></v-checkbox>
            </v-col>

            <v-col cols="10">
              <v-text-field
                @change="changeInput(index)"
                @click="clickInput(index)"
                v-model="copyTask.subTaskList[index]"
              ></v-text-field>
            </v-col>

            <v-col cols="1">
              <v-btn class="ma-2" icon color="error" @click="deleteSubTask(index)">
                <v-icon dark>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <!--Add-->
        <v-container>
          <v-row>
            <v-spacer></v-spacer>
            <v-col cols="2">
              <v-btn fab small color="success" @click="createNewSubTask()">
                <v-icon dark>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-spacer></v-spacer>
            <v-btn class="ma-1" color="primary" text @click="saveTask()">
              Сохранить
            </v-btn>
            <v-btn class="ma-1" color="error" text @click="cancelTask()">
              Отмена
            </v-btn>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
    <del-dialog v-if="delDialog" :taskId="taskId" :action="action"></del-dialog>
  </v-row>
</template>
  
  
  
<script>
import { mapGetters, mapActions } from "vuex";
import DelDialog from "./DelDialog.vue";

export default {
  name: "TaskMenu",
  components: {
    DelDialog,
  },
  props: {
    taskId: Number,
  },
  data: () => ({
    undoStackAction: [],
    redoStackAction: [],
    textInput: "",
    copyTask: {},
    action: ""
  }),
  computed: {
    ...mapGetters({
      dialog: "menu/dialog",
      delDialog: "delMenu/dialog",
      taskList: "taskList/taskList",
    }),
    getTask() {
      let indexTask = this.taskList.map((el) => el.id).indexOf(this.taskId);
      console.log("Vue/TaskMenu/getTask/indexTask " + indexTask);
      return this.taskList[indexTask];
    },
  },
  methods: {
    ...mapActions({
      changeDialog: "menu/changeDialog",
      changeDelDialog: "delMenu/changeDialog",
      updateTaskList: "taskList/updateTaskList",
    }),
    openDeleteTask(task_id) {
      console.log("Vue/TaskMenu/openDeleteTask/task_id " + task_id);

      this.action = "удалить"
      this.changeDelDialog(true);
    },
    deleteSubTask(task_index) {
      // 3 undo
      this.undoStackAction.push({
        id: 3,
        action: {
          index: task_index,
          task: this.copyTask.subTaskList[task_index],
          flag: this.copyTask.performedList[task_index],
        },
      });
      this.redoStackAction = [];

      console.log("Vue/TaskMenu/deleteTask/task_index " + task_index);

      this.copyTask.subTaskList.splice(task_index, 1);
      this.copyTask.performedList.splice(task_index, 1);
    },
    createNewSubTask() {
      // 4 undo
      this.undoStackAction.push({
        id: 4,
        action: {
          index: this.copyTask.subTaskList.length,
        },
      });
      this.redoStackAction = [];

      console.log("Vue/TaskMenu/createNewSubTask " + this.copyTask.subTaskList);

      this.copyTask.subTaskList.push("New Subtask");
      this.copyTask.performedList.push(false);
    },
    saveTask() {
      this.updateTaskList(this.copyTask);
      
      this.changeDialog(false);

      console.log("Vue/TaskMenu/saveTask ");
    },
    cancelTask() {
      this.action = "отменить"
      this.changeDelDialog(true);
    },
    pushBtn(index) {
      // 1 undo
      this.undoStackAction.push({
        id: 1,
        action: {
          index: index,
          flag: !this.copyTask.performedList[index],
        },
      });
      this.redoStackAction = [];

      console.log("Vue/TaskMenu/pushBtn/index " + index);
    },
    changeInput(index) {
      // 2 undo
      this.undoStackAction.push({
        id: 2,
        action: {
          index: index,
          text: this.textInput,
        },
      });
      this.redoStackAction = [];

      console.log("Vue/TaskMenu/changeInput " + index);
    },
    clickInput(index) {
      this.textInput = this.copyTask.subTaskList[index];

      console.log("Vue/TaskMenu/clickInput " + this.textInput);
    },
    undo() {
      let undoAction = {};

      if (this.undoStackAction.length > 0) {
        undoAction = this.undoStackAction.pop();
      }
      else {
        undoAction = { id: -1 };
      }

      console.log("Vue/TaskMenu/undo " + undoAction.id);

      switch (undoAction.id) {
        // отметка подзадачи
        case 1:
          this.redoStackAction.push({
            id: 1,
            action: {
              index: undoAction.action.index,
              flag: !undoAction.action.flag,
            },
          });

          this.copyTask.performedList.splice(undoAction.action.index, 1, undoAction.action.flag);
          break;

        // название подзадачи
        case 2:
          this.redoStackAction.push({
            id: 2,
            action: {
              index: undoAction.action.index,
              text: this.copyTask.subTaskList[undoAction.action.index],
            },
          });

          this.copyTask.subTaskList.splice(undoAction.action.index, 1, undoAction.action.text);
          break;

        // удаление подзадачи
        case 3:
          this.redoStackAction.push({
            id: 3,
            action: {
              index: undoAction.action.index,
              flag: undoAction.action.flag,
            },
          });

          this.copyTask.subTaskList.splice(undoAction.action.index, 0, undoAction.action.task);
          this.copyTask.performedList.splice(undoAction.action.index, 0, undoAction.action.flag);
          break;

        // создание подзадачи
        case 4:
          this.redoStackAction.push({
            id: 4,
            action: {
              index: undoAction.action.index,
              task: this.copyTask.subTaskList[undoAction.action.index],
              flag: false,
            },
          });

          this.copyTask.subTaskList.splice(undoAction.action.index, 1);
          this.copyTask.performedList.splice(undoAction.action.index, 1);
          break;

        default: break;
      }
    },
    redo() {
      let redoAction = {};

      if (this.redoStackAction.length > 0) {
        redoAction = this.redoStackAction.pop();
      }
      else {
        redoAction = { id: -1 };
      }

      console.log("Vue/TaskMenu/redo " + redoAction.id);

      switch (redoAction.id) {
        // отметка подзадачи
        case 1:
          this.undoStackAction.push({
            id: 1,
            action: {
              index: redoAction.action.index,
              flag: !redoAction.action.flag,
            },
          });
          this.copyTask.performedList.splice(redoAction.action.index, 1, redoAction.action.flag);

          break;

        // название подзадачи
        case 2:
          this.undoStackAction.push({
            id: 2,
            action: {
              index: redoAction.action.index,
              text: this.copyTask.subTaskList[redoAction.action.index],
            },
          });

          this.copyTask.subTaskList.splice(redoAction.action.index, 1, redoAction.action.text);
          break;

        // удаление подзадачи
        case 3:
          this.undoStackAction.push({
            id: 3,
            action: {
              index: redoAction.action.index,
              task: this.copyTask.subTaskList[redoAction.action.index],
              flag: redoAction.action.flag,
            },
          });

          this.copyTask.subTaskList.splice(redoAction.action.index, 1);
          this.copyTask.performedList.splice(redoAction.action.index, 1);
          break;

        // создание подзадачи
        case 4:
          this.undoStackAction.push({
            id: 4,
            action: {
              index: redoAction.action.index,
            },
          });

          this.copyTask.subTaskList.splice(redoAction.action.index, 0, redoAction.action.task);
          this.copyTask.performedList.splice(redoAction.action.index, 0, redoAction.action.flag);
          break;

        default:
          break;
      }
    },
  },
  beforeMount() {
    this.copyTask = JSON.parse(JSON.stringify(this.getTask));

    console.log("Vue/TaskMenu/beforeMount/copyTask " + this.copyTask.subTaskList);
  },
  beforeUpdate() {
    let indexTask = this.taskList.map((el) => el.id).indexOf(this.taskId);

    if (!(indexTask + 1)) {
      console.log("Vue/TaskMenu/beforeUpdate/changeDialog");
      this.changeDialog(false);
    }
  },
  updated() {
  },
};
</script>