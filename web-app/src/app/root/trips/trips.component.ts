import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http/http.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent implements OnInit {

  constructor(private httpService: HttpService) { }
  allTrips = [];
  ngOnInit() {
    this.getTrip();
  }

  getTrip() {
    this.httpService.getTrip(1).subscribe(res => {
      console.log(res);
      this.allTrips = res;
    })
  }

}
