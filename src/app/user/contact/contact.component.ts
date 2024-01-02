import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit { // This page includes the company's contact information

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigate(destination: string): void {
    this.router.navigate(["user/" + destination]);
  }

}
