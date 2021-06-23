import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Provider } from 'src/app/class/model';
import { StoreService } from 'src/app/service/store.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.scss']
})
export class ProviderComponent implements OnInit, OnDestroy, AfterViewInit {
  isCollapsed = true;
  provForm: FormGroup;
  provider: Provider[];
  dataSource = new MatTableDataSource<Provider>();
  fTitle = "Nouveau"
  url = null
  isDelete = false
  isNew = true
  spinner = false;
  baseUrl = environment.providerEndpoint
  displayedColumns = ['name', 'reliability', 'flexibility', 'maturity', 'dataSecurity', 'geoDispatching', 'price', 'action'];
  @ViewChild('myModal1', { static: false }) myModal1: ModalDirective
  @ViewChild('form', {static: true}) form: Element
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private storeService: StoreService,
    private formBuilder: FormBuilder
  ) { }

  scrollToElement($element): void {
    console.log($element);
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }
  ngOnInit(): void {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("profile-page");
    this.getAllproviders()
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

  getAllproviders() {
    console.log(this.baseUrl)
    this.storeService.getItems(this.baseUrl).then(data => {
      this.dataSource.data = data.results
      this.provider = data.results
      console.log(this.provider)
    })
  }
  get f() {
    return this.provForm.controls;
  }
  buildForm() {
    this.provForm = this.formBuilder.group({
      name: ['', Validators.required],
      relaibility: ['', Validators.required],
      flexibility: ['', Validators.required],
      maturity: ['', Validators.required],
      datasecurity: ['', [Validators.required, Validators.max, Validators.min]],
      geodispatching: ['', [Validators.required, Validators.max, Validators.min]],
      price: ['', [Validators.required, Validators.max, Validators.min]],
      url: ['']
    })
  }



  reset() {
    this.provForm.reset()
    this.fTitle = 'Nouveau'
  }
  submit() {
    if (this.provForm.invalid) {
      return
    }
    this.spinner = true;
    const prov = new Provider()
    prov.name = this.f.name.value
    prov.reliability = this.f.relaibility.value
    prov.flexibility = this.f.flexibility.value
    prov.maturity = this.f.maturity.value
    prov.data_security = this.f.datasecurity.value
    prov.geo_dispatching = this.f.geodispatching.value
    prov.price = this.f.price.value
    prov.url = this.f.url.value
    if (this.isNew) {
      this.create(prov)
    } else {
      this.update(prov)
    }

  }

  create(prov: Provider) {
    this.storeService.setItem(prov, this.baseUrl).then(data => {
      this.spinner = false;
      this.provForm.reset()
    })
  }

  update(prov: Provider) {
    this.storeService.updatItem(prov).then(data => {
      this.provForm.reset()
    })
  }

  edit(row: Provider) {
    this.fTitle = 'Update'
    this.isNew = false
    this.f.name.setValue(row.name)
    this.f.flexibility.setValue(row.flexibility)
    this.f.relaibility.setValue(row.reliability)
    this.f.maturity.setValue(row.maturity)
    this.f.datasecurity.setValue(row.data_security)
    this.f.geodispatching.setValue(row.geo_dispatching)
    this.f.price.setValue(row.price)
    this.f.url.setValue(row.url)
    this.scrollToElement(document.getElementById("form"))
  }

  show(url: string) {
    this.url = url
    this.myModal1.show()
  }

  delete() {
    if (this.url) {
      this.storeService.delItem(this.url).then(data => {

      })
    }
    this.myModal1.hide()
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("profile-page");

  }
}
