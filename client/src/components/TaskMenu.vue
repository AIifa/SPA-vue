<template>
  <v-row justify="center" v-if="menuDialog">
    <v-dialog v-model="menuDialog" persistent scrollable max-width="660px">
      <v-card height="80vh">
        <v-card-title>
          <v-btn
            class="mx-1"
            icon
            :disabled="undoStackAction.length <= 0"
            color="black"
            @click="undo"
          >
            <v-icon dark>mdi-arrow-left</v-icon>
          </v-btn>

          <v-btn
            class="mr-4"
            icon
            :disabled="redoStackAction.length <= 0"
            color="black"
            @click="redo"
          >
            <v-icon dark>mdi-arrow-right</v-icon>
          </v-btn>

          <span class="text-h5">Редактирование задания</span>
        </v-card-title>

        <!--<v-container>-->
        <v-card-title class="py-0">
          <v-row>
            <v-text-field
              style="align-items: baseline"
              v-model="copyTask.title"
              flat
              solo
              class="text-h6"
            >
              <template v-slot:append-outer>
                <v-btn icon color="error" @click="openDeleteTask">
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
              <v-btn
                class="ma-2"
                icon
                color="error"
                @click="deleteSubTask(index)"
              >
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
              <v-btn fab small color="success" @click="createNewSubTask">
                <v-icon dark>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-spacer></v-spacer>
            <v-btn class="ma-1" color="primary" text @click="saveTask">
              Сохранить
            </v-btn>
            <v-btn class="ma-1" color="error" text @click="cancelTask">
              Отмена
            </v-btn>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
    <del-dialog
      v-if="delDialog"
      :delDialog="delDialog"
      @closeDelDialog="delDialog = $event"
      @closeMenuDialog="$emit('closeMenuDialog', $event)"
      :taskId="taskId"
      :action="action"
    ></del-dialog>
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
    menuDialog: Boolean,
  },
  data: () => ({
    undoStackAction: [],
    redoStackAction: [],
    textInput: "",
    copyTask: {},
    action: "",
    delDialog: false,
  }),
  beforeMount() {
    this.copyTask = JSON.parse(JSON.stringify(this.getTask));
  },
  computed: {
    ...mapGetters({
      taskList: "taskList/taskList",
    }),
    getTask() {
      let indexTask = this.taskList.map((el) => el.id).indexOf(this.taskId);

      return this.taskList[indexTask];
    },
  },
  methods: {
    ...mapActions({
      updateTaskList: "taskList/updateTaskList",
    }),
    openDeleteTask() {
      this.action = "удалить";
      this.delDialog = true;
    },
    saveTask() {
      this.updateTaskList(this.copyTask);
      this.$emit("closeMenuDialog", false);
    },
    cancelTask() {
      this.action = "отменить";
      this.delDialog = true;
    },
    clickInput(index) {
      this.textInput = this.copyTask.subTaskList[index];
    },
    pushBtn(index) {
      // SET_MARK undo
      const SET_MARK = 1;
      this.undoStackAction.push({
        id: SET_MARK,
        action: {
          index: index,
          flag: !this.copyTask.performedList[index],
        },
      });
      this.redoStackAction = [];
    },
    changeInput(index) {
      // NAME_SUBTASK undo
      const NAME_SUBTASK = 2;
      this.undoStackAction.push({
        id: NAME_SUBTASK,
        action: {
          index: index,
          text: this.textInput,
        },
      });
      this.redoStackAction = [];
    },
    deleteSubTask(task_index) {
      // DEL_SUBTASK undo
      const DEL_SUBTASK = 3;
      this.undoStackAction.push({
        id: DEL_SUBTASK,
        action: {
          index: task_index,
          task: this.copyTask.subTaskList[task_index],
          flag: this.copyTask.performedList[task_index],
        },
      });
      this.redoStackAction = [];

      this.copyTask.subTaskList.splice(task_index, 1);
      this.copyTask.performedList.splice(task_index, 1);
    },
    createNewSubTask() {
      // ADD_SUBTASK undo
      const ADD_SUBTASK = 4;
      this.undoStackAction.push({
        id: ADD_SUBTASK,
        action: {
          index: this.copyTask.subTaskList.length,
        },
      });
      this.redoStackAction = [];

      this.copyTask.subTaskList.push("New Subtask");
      this.copyTask.performedList.push(false);
    },
    undo() {
      this.undoRedo(this.undoStackAction, this.redoStackAction);
    },
    redo() {
      this.undoRedo(this.redoStackAction, this.undoStackAction);
    },
    undoRedo(popStackAction, pushStackAction) {
      let undoRedoAction = {};

      if (popStackAction.length > 0) {
        undoRedoAction = popStackAction.pop();
      } else {
        const EMPTY_STACK = -1;
        undoRedoAction = { id: EMPTY_STACK };
      }

      const SET_MARK = 1;
      const NAME_SUBTASK = 2;
      const DEL_SUBTASK = 3;
      const ADD_SUBTASK = 4;

      switch (undoRedoAction.id) {
        // отметка подзадачи
        case SET_MARK:
          pushStackAction.push({
            id: SET_MARK,
            action: {
              index: undoRedoAction.action.index,
              flag: !undoRedoAction.action.flag,
            },
          });

          this.copyTask.performedList.splice(
            undoRedoAction.action.index,
            1,
            undoRedoAction.action.flag
          );
          break;

        // название подзадачи
        case NAME_SUBTASK:
          pushStackAction.push({
            id: NAME_SUBTASK,
            action: {
              index: undoRedoAction.action.index,
              text: this.copyTask.subTaskList[undoRedoAction.action.index],
            },
          });

          this.copyTask.subTaskList.splice(
            undoRedoAction.action.index,
            1,
            undoRedoAction.action.text
          );
          break;

        // удаление подзадачи
        case DEL_SUBTASK:
          pushStackAction.push({
            id: DEL_SUBTASK,
            action: {
              index: undoRedoAction.action.index,
              flag: undoRedoAction.action.flag,
            },
          });

          this.copyTask.subTaskList.splice(
            undoRedoAction.action.index,
            0,
            undoRedoAction.action.task
          );
          this.copyTask.performedList.splice(
            undoRedoAction.action.index,
            0,
            undoRedoAction.action.flag
          );
          break;

        // создание подзадачи
        case ADD_SUBTASK:
          pushStackAction.push({
            id: ADD_SUBTASK,
            action: {
              index: undoRedoAction.action.index,
              task: this.copyTask.subTaskList[undoRedoAction.action.index],
              flag: false,
            },
          });

          this.copyTask.subTaskList.splice(undoRedoAction.action.index, 1);
          this.copyTask.performedList.splice(undoRedoAction.action.index, 1);
          break;

        default:
          break;
      }
    },
  },
};
</script>