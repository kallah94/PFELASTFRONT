import { Component, OnDestroy, OnInit } from '@angular/core';
import { StoreService } from 'src/app/service/store.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  providers = 0;
  constructor(
    private storeService: StoreService
  ) { }

  ngOnInit(): void {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("landing-page");
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("landing-page");
  }

  itemCount(url: string): number {
    let count = 0;
    this.storeService.getItems(url).then( data => {
      count = data.count
    })
    return count
  }
}
