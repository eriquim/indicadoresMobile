import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders, HttpParams, } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { tap } from 'rxjs/operators';


const TOKEN_KEY = 'auth-token';

const apiUrl = 'http://localhost:8080/tjrn-default/security_check_external';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    authenticationState = new BehaviorSubject(false);


    loginData = { username: 'admin', password: 'admin' };


    constructor(private storage: Storage, private plt: Platform, public httpClient: HttpClient) {
        this.plt.ready().then(() => {
            this.checkToken();
        });
        this.ping();
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

    login4() {
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

    loginCors() {
        console.log('Entrou no login...');
         const headers = new HttpHeaders(this.loginData ? {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
            'Accept': 'application/json',
            'content-Type': 'application/json',

        } : {});
        return this.httpClient.post(apiUrl,
            { username: 'admin', password: 'admin' },
             { headers: headers }
        ).subscribe(
            tap(token => {
                this.storage.set(TOKEN_KEY, token)
                    .then(
                        () => {
                            console.log('Token Guardado');
                             this.authenticationState.next(true);
                        },
                        error => console.error('Erro token', error)
                    );
                return token;
            }),
        );
    }

    login() {
        console.log('Entrou no login...');
        const credentials = {username: 'admin', password: 'admin'};

        const headers = new HttpHeaders(credentials ? {
            'Origin': 'ionic',
            'Accept': 'application/json',
            'Content-Type': 'application/json charset=utf-8',
            'Authorization': 'Basic ' + btoa(this.loginData.username + ':' + this.loginData.password)
        } : {});

        console.log('Usuario: ' + btoa(this.loginData.username + ':' + this.loginData.password));
        this.httpClient.post(apiUrl,  {headers: headers}).subscribe(response => {
            if (response['name']) {
                console.log(response);
               this.loginS();
            } else {
                console.error('Erro no app: ' + response);
                this.logout();
            }
        }, catchError(this.handleError('login', Response)));
    }

    public ping() {
        this.httpClient.get(apiUrl)
            .subscribe(
                data => console.log(data),
                err => console.log(err)
            );
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

    private handleError<T>(operation = 'operation', result?: T) {
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
