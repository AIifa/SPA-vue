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
          <v-btn color="red darken-1" text @click="changeDelDialog(false)">
            Нет
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
  
  <script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "delDialog",
  props: {
    taskId: Number,
    action: String
  },
  data: () => ({}),
  computed: {
    ...mapGetters({
      dialog: "delMenu/dialog",
    }),
  },
  methods: {
    ...mapActions({
      changeDialog: "menu/changeDialog",
      changeDelDialog: "delMenu/changeDialog",
      delTask: "taskList/delTask",
      
    }),
    yesAcception() {
      // console.log(this.action)
      if (this.action == "удалить") {
        // console.log("Vue/DelDialog/yesAcception/True " + this.taskId)
        
        console.log("Vue/DelDialog/yesAcception/True " + this.action)
        this.delTask(this.taskId);
      }
      else if(this.action == "отменить"){
        console.log("Vue/DelDialog/yesAcception/False " + this.action)
        this.changeDialog(false);
      }
      this.changeDelDialog(false);
    },
  },
};
</script>