<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="370">
      <v-card>
        <v-card-title class="text-h5">
          Вы точно хотите {{ this.action }}?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="yesAcception()">
            Да
          </v-btn>
          <v-btn color="red darken-1" text @click="dialog = false"> Нет </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "delDialog",
  props: {
    taskId: Number,
    action: String,
    delDialog: Boolean,
  },
  methods: {
    ...mapActions({
      changeDialog: "menu/changeDialog",
      delTask: "taskList/delTask",
    }),
    yesAcception() {
      if (this.action == "удалить") {
        this.$emit("popListHideShow");
        this.delTask(this.taskId);
      } else if (this.action == "отменить") {
      }
      this.$emit("closeMenuDialog", false);
      this.dialog = false;
    },
  },
  computed: {
    dialog: {
      get() {
        return this.delDialog;
      },
      set(value) {
        this.$emit("closeDelDialog", value);
      },
    },
  },
};
</script>
