import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) {

  }

  ngOnInit(): void {

  }

  navigate(destination: string): void { // Navigate to the page according to the link pressed
    this.router.navigate([destination]);
  }

}
