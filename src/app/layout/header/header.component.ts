import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { MenuMobileComponent } from './menu-mobile/menu-mobile.component';
import { UserSectionComponent } from './user-section/user-section.component';
import { NgIf, UpperCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    standalone: true,
    imports: [
      NgIf,
      MatIconModule,
      UserSectionComponent,
      MenuMobileComponent,
      UpperCasePipe,
    ],
})
export class HeaderComponent implements OnInit {
  fullName: string = '';
  nameini!: string;
  userAbbreviation = '';
  fixedAside: boolean = true;
  phtouri = "NONE";

  constructor(
    public authService: AuthService,
    private menuService: MenuService,
  ) {}

  ngOnInit(): void {
    this.initializeUser();
    this.userFullName();
  }

  currentUser: string = '';
  userRolName: string = '';
  userFullName() {
    this.authService.getCurrentUser().subscribe((resp) => {
          this.currentUser = resp.result.user.nombres + ' '+ resp.result.user.apellidoPaterno ;
          this.userRolName = resp.result.user.rolName;
          console.log('USER-NEW =>', resp.result, this.currentUser, resp.result.user.rolName);
          console.log('ROL_USUARIO', this.userRolName);

        })
      }

  // userName:"JYsantiago"
  initializeUser() {
    this.fullName = this.authService.getUsername();

    const names: string[] = this.fullName.split(" ");
    if (names.length > 1){
      this.nameini = names[0].charAt(0) + names[1].charAt(0);
    }else{
      this.nameini = names[0].substr(0,2).toUpperCase();
    }
  }

  openMobileMenu() {
    this.menuService.activeMenuMobile.emit(true);
  }

  logOut() {
    this.authService.logout();
  }
}
