import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth.service';
import { LogoutComponent } from '../modal-logout/logout.component';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-user-section',
    templateUrl: './user-section.component.html',
    standalone: true,
    imports: [NgIf],
})
export class UserSectionComponent implements OnInit {
  @Input('nameini')  nameini: string='';
  @Input('photouri') photouri:string = 'NONE';

  hasphoto = false;

  constructor(private authService: AuthService,
              private dialog: MatDialog
    ) {}

  ngOnInit(): void {
    if (this.photouri != 'NONE') {
      this.hasphoto = true;
    }
  }

  openPanel() {
    this.authService.toggleUserPanel.emit(true);
  }

  openLogout() {
    const dialogRef = this.dialog.open(LogoutComponent, {width: '25%',});

    dialogRef.afterClosed().subscribe((resp) => {
      if (resp) {
        // this.cargarOBuscarVacaciones();
      }
    });
  }

}










// import {Component, ViewChild} from '@angular/core';
// import {MatDialog, MatDialogModule} from '@angular/material/dialog';
// import {MatMenuTrigger, MatMenuModule} from '@angular/material/menu';
// import {MatButtonModule} from '@angular/material/button';

// @Component({
//   selector: 'user-section',
//   templateUrl: 'user-section.component.html',
//   standalone: true,
//   imports: [MatButtonModule, MatMenuModule, MatDialogModule],
// })

// export class DialogFromMenuExample {
//   @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;

//   constructor(public dialog: MatDialog) {}

//   openDialog() {
//     const dialogRef = this.dialog.open(CambiarPassword, {restoreFocus: false});

//     dialogRef.afterClosed().subscribe(() => this.menuTrigger.focus());
//   }
// }

// @Component({
//   selector: 'dialog-from-menu-dialog',
//   templateUrl: 'change-password.component.html',
//   standalone: true,
//   imports: [MatDialogModule, MatButtonModule],
// })
// export class CambiarPassword {}
