import { Component, ElementRef, HostListener, NgModule, NgZone, OnInit, ViewChild, ApplicationRef, AfterViewInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { GeoLocationService } from '../../services/geo-location.service';
declare var google: any;
import { HttpClient } from '@angular/common/http'
declare var Stripe: any;
import { HttpService } from '../../services/http/http.service';
const stripe = Stripe('pk_test_Op8Ni0VhOtFTMAZ440GHYLIM');
const elements = stripe.elements();
const card = elements.create('card')

@Component({
  selector: 'app-booking-aap',
  templateUrl: './booking-aap.component.html',
  styleUrls: ['./booking-aap.component.css'],
  providers: [GeoLocationService]
})
export class BookingAapComponent implements OnInit, AfterViewInit {
  title: string = 'My first AGM project';
  lat: number;
  lng: number;
  coordinates: any;
  destLat: number;
  destLgn: number;
  sourceLocation: string;
  destinationLocation: string;
  distance: any;
  price: any;
  oneKMRs: number;
  carType: number = -1;
  selectedCarType: string;
  carStatus: string;
  paymentStatus: string;
  driver: any;
  trip: any;
  availability: string

  submitted = false;
  onSubmit() { this.submitted = true; }
  showPayForm: boolean;
  showStatus: boolean;
  origin: any;
  destination: any

  public searchControl: FormControl;
  public zoom: number;
  public currentAddress: string;
  private geoCoder;
  @ViewChild("searchSource")
  public searchElementRef: ElementRef;
  @ViewChild("searchDestination")
  public searchElementRefd: ElementRef;
  @ViewChild('form') form: ElementRef;
  @ViewChild('cardForm') cardForm: ElementRef;

  encRequest: String;
  accessCode: String;
  report: string;

  constructor(private locationService: GeoLocationService, private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone, private http: HttpClient, private httpService: HttpService) { }

  ngOnInit() {
    this.sourceLocation = '';
    this.destinationLocation = '';
    this.oneKMRs = 10;
    this.showPayForm = false;

    this.searchControl = new FormControl();
    //set current position
    this.setCurrentPosition();
    this.loadAutoComplete();
  }

  ngAfterViewInit() {
    // if (this.showPayForm)
    //   card.mount(this.cardForm.nativeElement);
  }

  //payment 
  handleForm(e) {
    var promise = stripe.createToken(card);
    promise.then(function (result) {
      // console.log(result);
    });
    setTimeout(() => {
      this.carStatus = 'booked';
      this.paymentStatus = 'done';
      this.bookTrip();
    }, 30)
  }

  bookTrip() {
    this.httpService.tripBook({
      "source": this.sourceLocation,
      "destination": this.destinationLocation,
      "bookingStatus": this.carStatus,
      "paymentStatus": this.paymentStatus,
      "amount": this.price,
      "userId": 1,
      "carType": this.selectedCarType,
      "driverId": 1
    }, 1).subscribe(res => {
      this.driver = res[0];
      this.trip = res[1]
      //console.log(this.driver);
      //console.log(this.trip);
      this.showStatus = true;
    })
  }

  loadAutoComplete() {
    this.mapsAPILoader.load().then(() => {
      // Fetch GeoCoder for reverse geocoding
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete1 = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      let autocomplete2 = new google.maps.places.Autocomplete(this.searchElementRefd.nativeElement, {
        types: ["address"]
      });
      autocomplete1.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: any = autocomplete1.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.sourceLocation = place.formatted_address;
          //set latitude, longitude and zoom
          this.lat = parseFloat(place.geometry.location.lat());
          this.lng = parseFloat(place.geometry.location.lng());
          if (this.destLat)
            this.getDirection();
        });
      });
      autocomplete2.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: any = autocomplete2.getPlace();
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.destinationLocation = place.formatted_address;
          //set latitude, longitude and zoom
          this.destLat = parseFloat(place.geometry.location.lat());
          this.destLgn = parseFloat(place.geometry.location.lng());
          this.getDirection();
        });
      });
    });
  }

  markerDragEnd(event: any) {
    //console.log(event);
    this.lat = parseFloat(event.coords.lat);
    this.lng = parseFloat(event.coords.lng);
    this.geoCoder.geocode({ 'location': { lat: this.lat, lng: this.lng } }, (results, status) => {
      //console.log(results);
      //console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          //console.log('aaaa');
          this.currentAddress = results[0].formatted_address;
          // this.searchElementRef.nativeElement.value = results[0].formatted_address);
          // console.log(this.searchElementRef.nativeElement.value);
          // infowindow.setContent(results[0].formatted_address);

        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
    }
  }

  onChangeLocation(event) {
    this.destLat = event.coords.lat;
    this.destLgn = event.coords.lng;
    this.getDirection();
  }

  getDirection() {
    try {
      this.origin = { lat: this.lat, lng: this.lng }
      this.destination = { lat: this.destLat, lng: this.destLgn }
    } catch{ }
    // this.origin = 'Taipei Main Station'
    // this.destination = 'Taiwan Presidential Office'
    this.calculateDistance();
  }

  calculateDistance() {
    const mexicoCity = new google.maps.LatLng(this.lat, this.lng);
    const jacksonville = new google.maps.LatLng(this.destLat, this.destLgn);
    this.distance = (google.maps.geometry.spherical.computeDistanceBetween(mexicoCity, jacksonville) / 1000).toFixed(2);
  }

  selectCar() {
    // console.log(this.carType);
    if (this.carType == 1) {
      this.oneKMRs = 7;
      this.selectedCarType = 'Micro';
    }
    else if (this.carType == 2) {
      this.oneKMRs = 10;
      this.selectedCarType = 'Mini';
    }
    else if (this.carType == 3) {
      this.oneKMRs = 15;
      this.selectedCarType = 'Prime';
    }
    else if (this.carType == 4) {
      this.oneKMRs = 20;
      this.selectedCarType = 'Lux';
    }

    this.httpService.checkAvailability({ carType: this.selectedCarType })
      .subscribe(res => {
        if (res == null) {
          this.availability = 'Note available'
        }
        else {
          this.availability = 'Available'
          //this.price = (this.distance * this.oneKMRs).toFixed(2);
        }

        //console.log(this.availability);
      })

    if (this.sourceLocation && this.destinationLocation) {
      this.price = (this.distance * this.oneKMRs).toFixed(2);
    }
  }

  paymentForm() {
    this.showPayForm = true;
    this.showStatus = false;
    setTimeout(() => {
      card.mount(this.cardForm.nativeElement);
    }, 0)
  }

  tripCancel() {
    this.httpService.tripCancel(this.trip.id).subscribe(res => {
      this.showPayForm = false;
      this.showStatus = false;
      this.origin = '';
      this.destination = ''
      this.carType = -1;
      this.lat = 0; this.lng = 0; this.destLat = 0; this.destLgn = 0;
      this.searchControl = new FormControl();
      this.setCurrentPosition();
      this.getDirection();
      window.location.reload();
    })
  }

  saveReport() {
    this.httpService.postReport({
      "tripId": this.trip.id,
      "report": this.report
    }).subscribe(res => {
    })
  }
}
