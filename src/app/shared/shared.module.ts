import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

// Pipes Module
import { PipesModule } from '../pipes/pipes.module';

import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        PipesModule,
        MaterialModule
    ],
    declarations: [
        PagenotfoundComponent,
        HeaderComponent,
        SidebarComponent,
        BreadcrumbsComponent,
        SpinnerComponent,
    ],
    exports: [
        PagenotfoundComponent,
        HeaderComponent,
        SidebarComponent,
        BreadcrumbsComponent,
        SpinnerComponent,
    ],
})

export class SharedModule {}
