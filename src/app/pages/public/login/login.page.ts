import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    loginForm = new FormGroup({ username: new FormControl(''), password: new FormControl('')});

    loading: any;

   constructor(private authService: AuthenticationService,
                private loadingCtrl: LoadingController,
                private fb: FormBuilder) { }

  ngOnInit() {
        this.loginForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
  });
  }

  login() {
    if (this.loginForm.invalid) {
        return;
    }
    this.presentLoading('Autenticando no servidor');
    this.authService.login(this.loginForm.value);
    this.loading.dismiss();
  }

   async presentLoading(msg: string) {
        this.loading = await this.loadingCtrl.create({
            message: msg,
            duration: 2000
        });

        this.loading.present();
    }

}
