import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { User } from '../../../classes/user';
import { UserProfilePage } from '../user-profile/user-profile';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ UserProvider ]
})
export class HomePage {
  public users: User[];

  constructor(public navCtrl: NavController, public userProvider: UserProvider) {
    this.loadUsers();
  }

  loadUsers() {
    this.userProvider.loadUsers()
                     .subscribe(data => {
                       this.users = data;
                     });
  }

  navToUser(user: User) {
    this.navCtrl.push(UserProfilePage, {
      user: user
    });
  }

}
