import { NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { CoreModule } from '../core/core.module';
import { AsideComponent } from './aside/aside.component';
import { BaseComponent } from './base/base.component';
import { FooterComponent } from './footer/footer.component';
import { MenuMobileComponent } from './header/menu-mobile/menu-mobile.component';
import { LogoutComponent } from './header/modal-logout/logout.component';
import { UserSectionComponent } from './header/user-section/user-section.component';
import { UserPanelComponent } from './user-panel/user-panel.component';
import { HeaderComponent } from './header/header.component';
import { BlockUIModule } from 'ng-block-ui';


@NgModule({
    exports: [
        HeaderComponent,
        AsideComponent,
        FooterComponent,
        UserSectionComponent,
        BaseComponent,
        MenuMobileComponent,
        UserPanelComponent,
        // LogoutComponent
    ],
    imports: [
        CoreModule,
        MaterialModule,
        BlockUIModule.forRoot(),
        UserPanelComponent,
        HeaderComponent,
        AsideComponent,
        FooterComponent,
        UserSectionComponent,
        BaseComponent,
        MenuMobileComponent
    ]
})
export class LayoutModule {}
