import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserPanelComponent } from '../user-panel/user-panel.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { BlockUIModule } from 'ng-block-ui';
import { AsideComponent } from '../aside/aside.component';
import { HeaderComponent } from '../header/header.component';
import { NgIf, NgClass } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
    selector: 'app-base',
    templateUrl: './base.component.html',
    styleUrls: ['./base.component.scss'],
    standalone: true,
    imports: [
      NgIf,
      HeaderComponent,
      AsideComponent,
      NgClass,
      BlockUIModule,
      RouterOutlet,
      FooterComponent,
      UserPanelComponent,
      MatDialogModule,
      MatNativeDateModule
    ]
})
export class BaseComponent implements OnInit {
  fixedAside: Boolean = true; //OJO Verificar
  loading: boolean = true;
  menuError: boolean = false;
  message: string = 'Preparando contenido...';
  fullName: string = '';
  userAbbreviation = '';
  rolId: number = 0;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.initializeUser();
  }

  changeSideFixed(event: Boolean) {
    this.fixedAside = event;
  }

  initializeUser() {
    this.fullName = this.authService.getUsername();
    this.rolId = this.authService.getRolID(); //Obtenemos el ROl_ID del usuario logeado: 101,102,103 (106: SUPER_ADMIN)

    console.log('fullName', this.fullName, this.rolId);

    if (this.fullName) {
      const fullNameToArray = this.fullName.split(' ').map((item: string) => {
        return item.substring(0, 1).toUpperCase();
      });
      this.userAbbreviation = fullNameToArray.join('');
    }
  }

}
