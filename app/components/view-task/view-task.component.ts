import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { GlobalVarsService } from "../../services/global-vars.service";



@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css']
})
export class ViewTaskComponent implements OnInit {
  task:Task;
  date:string;

  constructor(
    private taskService: TaskService,
    private globalVarsService: GlobalVarsService
  ) { 
    this.taskService.viewTransferListen().subscribe((task: Task) => {
      this.task = task;
      this.date = this.task.dueDate.toString().substr(0, 10)
    });
  }

  ngOnInit(): void {
    this.task = {
      title : undefined,
      dueDate : undefined,
      priority : undefined,
      label : undefined,
      status : undefined,
      isDone: undefined,
      gamification: undefined
    };
  }

  toggleTheme() {
    if(this.globalVarsService.mode) {
      let classes = {
        'darkTheme': true
      }
      return classes;
    }
  }
}
