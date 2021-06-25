import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Pricing } from 'src/app/class/model';
import { environment } from 'src/environments/environment';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { StoreService } from 'src/app/service/store.service';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss']
})
export class PriceComponent implements OnInit,OnDestroy, AfterViewInit{
  isCollapsed = true;
  priceForm:FormGroup;
  dataSource = new MatTableDataSource<Pricing>();
  title = "Nouveau"
  url = null;
  isDelete = false;
  isNew = true;
  spinner = false;
  baseUrl = environment.pricingEndpoint
  displayedColumns = ['provider','category','ram','cpu','price_per_hour','price_per_month','action']
  @ViewChild('myModal1', { static: false }) myModal1: ModalDirective
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private storeService:StoreService, 
    private formBuilder: FormBuilder) { }

    scrollToElement($element): void {
      $element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    }

  ngOnInit(): void {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("profile-page");
    this.getPricingItem()
    this.buildForm()
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getPricingItem(){
    this.storeService.getItems(this.baseUrl).then(
      data => {
        this.dataSource.data = data.results
        console.log(data);
      }
    )
  }
  get f() {
    return this.priceForm.controls;
  }

  buildForm() {
    this.priceForm = this.formBuilder.group({
      provider: ['', Validators.required],
      category: ['', Validators.required],
      ram: ['', Validators.required],
      cpu: ['', Validators.required],
      price_per_hour: ['', Validators.required],
      price_per_month: ['', Validators.required],
      url: ['']
    })
  }
  reset(){
    this.priceForm.reset()
    this.title = 'Nouveau'
  }

  submit(){
    if (this.priceForm.invalid){
      return
    }
    this.spinner = true;
    const price = new Pricing()
    price.provider = this.f.provider.value
    price.category = this.f.category.value
    price.ram = this.f.ram.value
    price.cpu = this.f.cpu.value
    price.price_per_hour = this.f.price_per_hour.value
    price.price_per_month = this.f.price_per_month.value
    price.url = this.f.url.value
    if(this.isNew){
      this.addPricing(price)
    }
    else{
      this.update(price)
    }
  }

  addPricing(price:Pricing){
    this.storeService.setItem(price, this.baseUrl).then(
      data => {
        this.spinner = false;
        this.priceForm.reset()
      }
    )
  }

  update(price:Pricing){
   this.storeService.updatItem(price).then(
     data => {
       this.priceForm.reset()
     }
   )
  }
  edit(row: Pricing){
    this.title = 'update'
    this.isNew = false
    this.f.provider.setValue(row.provider)
    this.f.category.setValue(row.category)
    this.f.ram.setValue(row.ram)
    this.f.cpu.setValue(row.cpu)
    this.f.price_per_hour.setValue(row.price_per_hour)
    this.f.price_per_month.setValue(row.price_per_month)
    this.f.url.setValue(row.url)
    this.scrollToElement(document.getElementById("form"))
  }

  show(url: string){
    this.url = url
    this.myModal1.show()
  }

  delete(){
    if(this.url){
      this.storeService.delItem(this.url).then(data =>
        {})
    }
    this.myModal1.hide()
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("profile-page");

  }

}
