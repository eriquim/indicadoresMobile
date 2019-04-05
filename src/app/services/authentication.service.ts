import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';


const TOKEN_KEY = 'auth-token';

const apiUrl = 'http://localhost:8080/tjrn-default/';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    authenticationState = new BehaviorSubject(false);


    loginData = { username: 'admin', password: 'admin' };


    constructor(private storage: Storage, private plt: Platform, public http: HttpClient) {
        this.plt.ready().then(() => {
            this.checkToken();
        });
    }

    checkToken() {
        this.storage.get(TOKEN_KEY).then(res => {
            if (res) {
                this.authenticationState.next(true);
            }
        });
    }

    login() {
        const postData = {
            'username': 'admin',
            'password': 'admin'
        };
        let httpHeaders = new HttpHeaders();
        httpHeaders = httpHeaders.set('Content-Type', 'application/json; charset=utf-8');
        this.http.post<any[]>(apiUrl + 'security_check', postData)
            .subscribe(data => {
                console.log(data['_body']);
            }, error => {
                console.log(error);
            });
    }
   login2(callback) {
        console.log('Entrou no login...');
        const headers = new HttpHeaders(this.loginData ? {
            authorization: 'Basic ' + btoa(this.loginData.username + ':' + this.loginData.password)
        } : {});

        this.http.post(apiUrl + 'security_check', { headers: headers }).subscribe(response => {
            if (response['name']) {
                this.loginS();
                console.log('Deu certo');
                console.log('response:' + response);
            } else {
            }
            return callback && callback();
        });
    }

// TODO Reescrever para login spring
loginS() {
    return this.storage.set(TOKEN_KEY, 'Bearer 1234567').then(() => {
        this.authenticationState.next(true);
    });
}

logout() {
    return this.storage.remove(TOKEN_KEY).then(() => {
        this.authenticationState.next(false);
    });
}

isAuthenticated() {
    return this.authenticationState.value;
}

    private handleError<T>(operation = 'operation', result ?: T) {
    return (error: any): Observable<T> => {

        console.error(error);

        this.log(`${operation} falhou: ${error.message}`);

        return of(result as T);
    };
}

    private log(message: string) {
    console.log(message);
}


}