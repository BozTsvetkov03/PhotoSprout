import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { AboutComponent } from './components/about/about.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { CatalogItemDetailsComponent } from './components/catalog/catalog-item/catalog-item-details/catalog-item-details.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { EditProfileComponent } from './components/user-profile/edit-profile/edit-profile.component';
import { AuthGuard } from './guards/auth.guard';
import { AddCatalogItemComponent } from './components/catalog/add-catalog-item/add-catalog-item.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'catalog', component: CatalogComponent },
    { path: 'about', component: AboutComponent},
    { path: 'contacts', component: ContactsComponent},
    { path: 'privacy', component: PrivacyPolicyComponent},
    { path: 'catalog/add', canActivate: [AuthGuard] ,component: AddCatalogItemComponent },
    { path: 'catalog/:id', component: CatalogItemDetailsComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent},
    { path: 'users/:id', component: UserProfileComponent},
    { path: 'users/:id/edit', canActivate: [AuthGuard], component: EditProfileComponent },

];
