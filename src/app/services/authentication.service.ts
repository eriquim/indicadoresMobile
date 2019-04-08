import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';


const TOKEN_KEY = 'auth-token';

const apiUrl = 'http://localhost:8080/tjrn-default/';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    authenticationState = new BehaviorSubject(false);


    loginData = { username: 'admin', password: 'admin' };


    constructor(private storage: Storage, private plt: Platform, public httpClient: HttpClient, public http: Http) {
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

    login2() {
        const postData = {
            'username': 'admin',
            'password': 'admin'
        };
        console.log('executando login');
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(this.loginData.username + ':' + this.loginData.password)
            })
        };
        console.log(apiUrl + 'security_check');
        const p = { params: new HttpParams().set('username', 'admin'), params2: new HttpParams().set('password', 'admin') };
        this.httpClient.post<any>(apiUrl + 'security_check', p,
            httpOptions).pipe(catchError(this.handleError('login', postData))
            );
    }

    login() {
        console.log('Entrou no login...');
        const headers = new HttpHeaders(this.loginData ? {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(this.loginData.username + ':' + this.loginData.password)
        } : {});

        this.httpClient.post(apiUrl + 'security_check', { headers: headers }).subscribe(response => {
            if (response['name']) {
                this.loginS();
                console.log('Deu certo');
                console.log('response:' + response);
            } else {
            }
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
