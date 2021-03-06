import { Component, OnInit } from '@angular/core';
import { Task } from "../../models/task";
import { ValidateService } from "../../services/validate.service";
import { TaskService } from "../../services/task.service";
import { UserService } from "../../services/user.service";
import { GlobalVarsService } from "../../services/global-vars.service";
import { FlashMessagesService } from "angular2-flash-messages";

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
  title:string;
  date:Date;
  priority:string;
  label:string;
  labels:Object[];
  //status:String;

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private globalVarsService: GlobalVarsService,
    private validateService: ValidateService,
    private flashMessage: FlashMessagesService
  ) { 
    this.userService.labelRefreshListen().subscribe((msg:string) => {
      let username = this.globalVarsService.user.username;
      this.userService.getLabels(username).subscribe((labelsArray) => {
        if(labelsArray.success) {
          this.labels = labelsArray.labels[0].labels;
        }
      }, err => { console.log(err); return false; })
    }); 
  }

  ngOnInit(): void {
    this.labels = this.globalVarsService.getLabels();
  }

  toggleTheme() {
    if(this.globalVarsService.mode) {
      let classes = {
        'darkTheme': true
      }
      return classes;
    }
  }

  addTask(event) {
    var newTask:Task = {
      title: this.title,
      dueDate: this.date,
      priority: this.priority,
      label: this.label,
      status: "Pending",
      isDone: false,
      gamification : {
        firstCheck: null,
        score: null
      }
    };

    if(!this.validateService.validateAddTask(newTask)) {
      this.flashMessage.show("Please fill in all fields!", {
        cssClass: 'alert-danger', 
        timeout: 3000
      });
      return false;
    }
    
    this.taskService.addTask(this.globalVarsService.user.username, newTask)
    .subscribe(createResults => {
      if(createResults.success) {
        this.flashMessage.show("New task added!", {
          cssClass: 'alert-success', 
          timeout: 3000
        });
        this.title = undefined;
        this.date = undefined;
        this.priority = undefined;
        this.label = undefined;
      } else {
        this.flashMessage.show(createResults.msg, {
          cssClass: 'alert-danger', 
          timeout: 3000
        });
      }
    }, err => { console.log(err); return false; })
  }

  listRefresh() {
    this.taskService.taskRefreshFilter("New task added!");
  }
}
