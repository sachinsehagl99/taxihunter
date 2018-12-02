import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router'
import { patch } from 'webdriver-js-extender';
import { BookingAapComponent } from './root/booking-aap/booking-aap.component';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction'
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxStripeModule } from 'ngx-stripe';
import { PaymentService } from './services/payment.service';
import { from } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { HttpService } from './services/http/http.service';
import { RootComponent } from './root/root.component';
import { TripsComponent } from './root/trips/trips.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SortStringPipe } from './sort-string.pipe';
import { AuthGuard } from './services/auth.guard';


const appRoute: Routes = [
  { path: '', redirectTo: '/app/bookingApp', pathMatch: 'full', canActivate: [AuthGuard] },
  {
    path: 'app', component: RootComponent, children: [
      { path: 'bookingApp', component: BookingAapComponent },
      { path: 'allTrips', component: TripsComponent },
    ]
  }
]

@NgModule({
  declarations: [
    AppComponent,
    BookingAapComponent,
    RootComponent,
    TripsComponent,
    SortStringPipe,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoute, { useHash: true }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBfDMCdi_ia7oM5FehKAZsm6c7RVhF4J3M',
      libraries: ["places", "geometry"]
    }),
    AgmDirectionModule,
    FormsModule,
    ReactiveFormsModule,
    NgxStripeModule.forRoot('sk_test_bIkFI8h8wKbxKfX2paoXeDqe'),
    HttpClientModule,
    NgxPaginationModule
  ],
  providers: [PaymentService, HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
