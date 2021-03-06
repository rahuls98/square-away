import { Injectable } from '@angular/core';
import { TaskService } from '../services/task.service';
import { UserService } from '../services/user.service';
import { Http, Headers } from '@angular/http';

interface Credentials {
  name?: string,
  username?: string
  email?: string,
  labels?: Object[],
  sag?: boolean,
  gamification?: {
    activeOn?: string[],
    score?: number,
    n?: number
  }
}

@Injectable({
  providedIn: 'root'
})
export class GlobalVarsService {
  user:Credentials;
  labels:string[];
  labelColorPallete:Object = {};
  mode:boolean;
  progress:number;

  constructor(
    private taskService: TaskService, 
    private userService: UserService, 
    private http: Http
  ) { }

  setTheme(mode:boolean) {
    this.mode = mode;
  }

  setLabels(labels:string[]) {
    this.labels = labels;
  }
  getLabels():string[] {
    return this.labels;
  }

  updateSAS(option:string, SAS:number) {
    if(option=='add') {
      console.log("Add SAS: " + SAS);
      let score = this.user.gamification.score;
      this.user.gamification.score = score + SAS;
      this.user.gamification.n += 1;
    } 
    else if(option=='sub') {
      console.log("Sub SAS: " + SAS);
      let score = this.user.gamification.score;
      this.user.gamification.score = score - SAS;
      this.user.gamification.n -= 1;
    }

    if((this.user.gamification.n > 0) && (this.user.gamification.score > 0)) 
      this.progress = (this.user.gamification.score / (this.user.gamification.n * 2)) * 100;
    else 
      this.progress = 0;

    this.taskService.progressRefreshFilter(this.progress);

    var body = JSON.stringify({
      username: this.user.username, 
      gamification: this.user.gamification,
    });
    this.userService.updateSAS(body).subscribe((res) => {
      console.log(res.json());
    });
  }
}
