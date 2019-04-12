import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Platform, ToastController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { User } from '../models/User';


export const TOKEN_KEY = 'auth-token';
export const CURRENT_USER = 'current_user';

const apiUrl = 'http://localhost:8080/tjrn-default/api/home';
const apiUrlLogout = 'http://localhost:8080/tjrn-default/api/logout';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    authenticationState = new BehaviorSubject(false);


    user = new User();



    constructor(private storage: Storage,
                private plt: Platform,
                private toastCtrl: ToastController,
                public httpClient: HttpClient) {
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

    login(credentials) {
        const headers = new HttpHeaders(credentials ? {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(credentials.username + ':' + credentials.password)
        } : {});
        this.httpClient.post(apiUrl,
                                    JSON.stringify(credentials),
                                    { headers: headers,
                                      responseType: 'text' as 'json'})
        .subscribe(
          (response: string) => {
            console.log('Login efetuado com sucesso: ' + response);
            const user = JSON.parse(response);
            this.gravarToken(credentials, user);
            this.presentToast('Login efetuado com sucesso: ');

        }, (responseError: HttpResponse<any>) => {
            if (responseError.status === 401) {
                console.log('Senha ou usuario invalido');
                this.presentToast('Senha ou usuario invalido');
            } else {
                console.log('Erro de conexao');
                this.presentToast('Nao foi possivel conectar ao servidor.');
            }
            this.handleError('login', responseError);
        } );
    }

    public ping() {
        this.httpClient.get(apiUrl)
            .subscribe(
                data => console.log(data),
                err => console.log(err)
            );
    }


    gravarToken(credentials, user) {
        this.user.login = user.login;
        this.user.nome = user.displayName;
        this.user.email = user.email;
        return this.storage.
                set(TOKEN_KEY, btoa(credentials.username + ':' + credentials.password)).
                then(() => {
            this.storage.set(CURRENT_USER, this.user);
            this.authenticationState.next(true);
        });
    }

    logout() {
        this.httpClient.get(apiUrlLogout)
            .subscribe(
                res => {
                    console.log('logout efetuado com sucesso' + res );
            },
                error => {
                    console.log('erro ao efetuar o login' + error);
                    this.handleError('logout', error);
            });
        return this.storage.remove(TOKEN_KEY).then(() => {
             this.storage.remove(CURRENT_USER);
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



    async presentToast(msg: string) {
        const toast = await this.toastCtrl.create({
            message: msg,
            duration: 2000
        });
        toast.present();
    }



}
