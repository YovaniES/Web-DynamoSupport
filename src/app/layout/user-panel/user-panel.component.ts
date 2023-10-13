import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { MenuService } from 'src/app/core/services/menu.service';

@Component({
  selector: 'app-user-panel',
  standalone: true,
  imports:[MatIconModule,CommonModule ],
  templateUrl: './user-panel.component.html',
  styles: [],
})
export class UserPanelComponent implements OnInit, OnDestroy {
  active: boolean = false; //true
  observablePanel: Subscription = new Subscription();
  fullname!: string;
  nameini!: string;
  subtitle: string = 'Super Admin';

  @ViewChild('ovelay') overlay: any;

  constructor(
    private menuServices: MenuService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.fullname = this.authService.getUsername();

    const names: string[] = this.fullname.split(' ');
    if (names.length > 1) {
      this.nameini = names[0].charAt(0) + names[1].charAt(0);
    } else {
      this.nameini = names[0].substr(0, 2).toUpperCase();
    }
    this.observablePanel = this.menuServices.toggleUserPanel.subscribe(
      (flag) => (this.active = flag)
    );
  }

  ngOnDestroy(): void {
    this.observablePanel.unsubscribe();
  }

  close() {
    this.active = false;
  }

  logOut() {
    localStorage.clear();
    this.router.navigateByUrl('/auth');
  }


}
