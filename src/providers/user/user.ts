import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { User } from '../../../classes/user';
/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {
  usersUrl = "http://localhost:8080/api/users";

  constructor(public http: HttpClient) {

  }

  loadUsers(): Observable<User[]> {
    return this.http.get<User>(this.usersUrl)
                    .catch(err => this.handleError(err));
  }

  updateUser(user: User) {
    let url = `${this.usersUrl}/${user.id}`;
    let body = JSON.stringify(user);
    let headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this.http.put(url, body, {headers: headers})
                    .catch(err => this.handleError(err));
  }

  delete(user: User) {
    let url = `${this.usersUrl}/${user.id}`;
    let headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this.http.delete(url, {headers: headers})
                    .catch(err => this.handleError(err));
  }


  handleError(err) {
    console.log(err);
    return Observable.throw( err || 'Server error');
  }
}
