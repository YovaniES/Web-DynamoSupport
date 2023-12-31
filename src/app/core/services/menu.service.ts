import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  toggleUserPanel = new EventEmitter<boolean>();
  activeMenuMobile = new EventEmitter<boolean>();
  sectionTitle = new EventEmitter<string>();

}
