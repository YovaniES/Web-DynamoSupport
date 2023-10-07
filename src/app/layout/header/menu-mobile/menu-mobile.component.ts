import { Component, OnInit } from '@angular/core';
import { Router, UrlTree, RouterLinkActive, RouterLink } from '@angular/router';
import { Menu } from 'src/app/core/models/menu.models';
import { PERMISSION } from 'src/app/core/routes/internal.routes';
import { MenuService } from 'src/app/core/services/menu.service';
import { MatIconModule } from '@angular/material/icon';
import { NgClass, NgFor, NgTemplateOutlet, NgIf } from '@angular/common';

@Component({
    selector: 'app-menu-mobile',
    templateUrl: './menu-mobile.component.html',
    styles: [],
    standalone: true,
    imports: [
        NgClass,
        MatIconModule,
        RouterLinkActive,
        RouterLink,
        NgFor,
        NgTemplateOutlet,
        NgIf,
    ],
})
export class MenuMobileComponent implements OnInit {
  subMenus: Menu[] = [];
  subMenuActive: boolean = false;
  subMenuTitle: string = '';
  active: boolean = false;
  headerLogo = './assets/images/logos/cardano.svg';

  menuList = [
    {
      id: 1,
      code: 'GES',
      text: 'GESTIÓN PERSONAL',
      order: 1,
      icon: 'people',
      type: 'PAREN',
      link: 'gestion',
      enable: false,
      module: 'Reporte',
      displayed: false,
      roles: PERMISSION.MENU_PERSONAS,
      submenus: [
        {
          code: 'MAN-001',
          text: 'Personal',
          order: 0,
          icon: 'how_to_reg',
          type: 'ALONE',
          link: 'gestion/personas',
          enable: false,
          module: 'MAN',
          displayed: false,
          roles: PERMISSION.SUBMENU_PERSONAS,
        },
        {
          code: 'MAN-002',
          text: 'Lista vacaciones',
          order: 20,
          icon: 'surfing',
          type: 'PAREN',
          link: 'gestion/vacaciones',
          enable: false,
          module: 'MAN',
          displayed: false,
          roles: PERMISSION.SUBMENU_VACACIONES,
        },
        {
          code: 'MAN-003',
          text: 'Recurso Hardware',
          order: 20,
          icon: 'phonelink',
          type: 'PAREN',
          link: 'gestion/hardware',
          enable: false,
          module: 'MAN',
          displayed: false,
          roles: PERMISSION.SUBMENU_HARDWARE,
        },
        {
          code: 'MAN-004',
          text: 'Recurso Cuenta',
          order: 20,
          icon: 'lock_clock',
          type: 'PAREN',
          link: 'gestion/cuentas',
          enable: false,
          module: 'MAN',
          displayed: false,
          roles: PERMISSION.SUBMENU_CUENTA,
        },
      ],
    },

    {
      id: 2,
      code: 'MAN',
      text: 'MANTENIMIENTO',
      order: 1,
      icon: 'settings_suggest',
      type: 'PAREN',
      link: 'mantenimiento',
      enable: false,
      module: 'administrador',
      displayed: false,
      roles: PERMISSION.MENU_MANTENIMIENTO,
      submenus: [
        {
          code: 'PAS-001',
          text: 'Entidad',
          order: 3,
          icon: 'dashboard_customize',
          type: 'PAREN',
          link: 'mantenimiento/entidad',
          enable: false,
          module: 'PAS',
          displayed: false,
          roles: PERMISSION.SUBMENU_ENTIDAD,
        },
      ],
    },

    {
      id: 2,
      code: 'DAS',
      text: 'DASHBOARD',
      order: 1,
      icon: 'dashboard_customize',
      type: 'PAREN',
      link: 'dashboard',
      enable: false,
      module: 'administrador',
      displayed: false,
      roles: PERMISSION.MENU_DASHBOARD,
      submenus: [
        {
          code: 'DAS-001',
          text: 'Haros',
          order: 3,
          icon: 'lock_open',
          type: 'PAREN',
          link: 'dashboard/haros',
          enable: false,
          module: 'PAS',
          displayed: false,
          roles: PERMISSION.SUBMENU_HAROS,
        },
        // {
        //   code: 'PAS-001',
        //   text: 'Incidencias Cerradas',
        //   order: 3,
        //   icon: 'lock',
        //   type: 'PAREN',
        //   link: 'dashboard/cerradas',
        //   enable: false,
        //   module: 'PAS',
        //   displayed: false,
        //   roles: PERMISSION.SUBMENU_HAROS,
        // },
        // {
        //   code: 'PAS-001',
        //   text: 'Incidencias Sustentadas',
        //   order: 3,
        //   icon: 'security_update_good',
        //   type: 'PAREN',
        //   link: 'dashboard/sustentadas',
        //   enable: false,
        //   module: 'PAS',
        //   displayed: false,
        //   roles: PERMISSION.SUBMENU_HAROS,
        // },
      ],
    },

    {
      id: 3,
      code: 'FAC',
      text: 'FACTURACIÓN',
      order: 1,
      icon: 'currency_exchange',
      type: 'PAREN',
      link: 'factura',
      enable: false,
      module: 'administrador',
      displayed: false,
      roles: PERMISSION.MENU_FACTURACION,
      submenus: [
        {
          code: 'FAC-001',
          text: 'Liquidación',
          order: 3,
          icon: 'paid',
          type: 'PAREN',
          link: 'factura/liquidacion',
          enable: false,
          module: 'PAS',
          displayed: false,
          roles: PERMISSION.SUBMENU_LIQUIDACION,
        },
        {
          code: 'FAC-004',
          text: 'DPF/ALO',
          order: 3,
          icon: 'manage_history',
          type: 'PAREN',
          link: 'factura/visordpf',
          enable: false,
          module: 'PAS',
          displayed: false,
          roles: PERMISSION.SUBMENU_VISOR,
        },
        {
          code: 'FAC-003',
          text: 'Liquidaciones proyecto',
          order: 3,
          icon: 'bar_chart',
          type: 'PAREN',
          link: 'factura/visorcierre',
          enable: false,
          module: 'PAS',
          displayed: false,
          roles: PERMISSION.SUBMENU_VISOR,
        },
        {
          code: 'FAC-003',
          text: 'Ventas declaradas',
          order: 3,
          icon: 'stacked_bar_chart',
          type: 'PAREN',
          link: 'factura/visordec',
          enable: false,
          module: 'PAS',
          displayed: false,
          roles: PERMISSION.SUBMENU_VISOR,
        },
        {
          code: 'FAC-003',
          text: 'Facturados',
          order: 3,
          icon: 'show_chart',
          type: 'PAREN',
          link: 'factura/visorfact',
          enable: false,
          module: 'PAS',
          displayed: false,
          roles: PERMISSION.SUBMENU_VISOR,
        },
        {
          code: 'FAC-003',
          text: 'Liquidaciones activas',
          order: 3,
          icon: 'pie_chart',
          type: 'PAREN',
          link: 'factura/visoract',
          enable: false,
          module: 'PAS',
          displayed: false,
          roles: PERMISSION.SUBMENU_VISOR,
        },
      ],
    },

  ];
  constructor(private menuService: MenuService, private router: Router) {}

  ngOnInit(): void {
    this.menuService.activeMenuMobile.subscribe((e) => (this.active = e));
  }

  close() {
    this.menuService.activeMenuMobile.emit(false);
  }

  closeSubMenu() {
    this.subMenuActive = false;
    this.subMenuTitle = '';
    this.subMenus = [];
  }
  showSubMenu(item: Menu) {
    this.subMenuActive = true;
    this.subMenus = item.submenus;
    this.subMenuTitle = item.text;
  }
  gotoPage(link: string | UrlTree) {
    this.subMenuActive = false;
    this.active = false;
    this.router.navigateByUrl(link);
  }
}
