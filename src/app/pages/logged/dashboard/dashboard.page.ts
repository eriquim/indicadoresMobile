import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { User } from '../../../models/User';
import { Storage } from '@ionic/storage';
import {CURRENT_USER} from '../../../services/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

    user: User;

   constructor(private authService: AuthenticationService,
            private storage: Storage) { }

  ngOnInit() {
    this.storage.get(CURRENT_USER).then( (userStorage: User) => {
        this.user = userStorage;
    });
  }

  logout() {
    this.authService.logout();
  }

}
