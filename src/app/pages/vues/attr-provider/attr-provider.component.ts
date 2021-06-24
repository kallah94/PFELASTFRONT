import { AfterViewInit, Component, OnDestroy, OnInit, Provider, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ProviderAttribut } from 'src/app/class/model';
import { StoreService } from 'src/app/service/store.service';
import { environment } from 'src/environments/environment';

interface TYP {
  value: string
  viewValue: string
}
interface ATTRIBUTES {
  value: string
  viewValue: string
}
@Component({
  selector: 'app-attr-provider',
  templateUrl: './attr-provider.component.html',
  styleUrls: ['./attr-provider.component.scss']
})
export class AttrProviderComponent implements OnInit, OnDestroy, AfterViewInit {

  attrForm: FormGroup
  dataSource = new MatTableDataSource<ProviderAttribut>()
  fTitle = 'Nouveau'
  isNew = true
  url: string
  spinner = false
  baseUrl = environment.attributeEndpoint
  displayedColumns = ["name", "type", "poids", "pourcentage", "action"]
  types: TYP[] = [
    {value: 'benefit', viewValue: 'Benefit'},
    {value: 'cost', viewValue: 'Cout'}
  ]
  attributes: ATTRIBUTES[] = [
    {value: "reliability", viewValue: 'Fiabilite'},
    {value: "flexibility", viewValue: 'Flexibilite' },
    {value: "maturity", viewValue: 'Maturite' },
    {value: "data_security", viewValue: 'Securite Donnees'},
    {value: "geo_dispatching", viewValue: "Repartion Geographique"},
    {value: "price", viewValue: 'Prix'}
  ]
  @ViewChild('myModal1', { static: false }) myModal1: ModalDirective
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private storeService: StoreService,
    private formBuilder: FormBuilder
  ) { }

  scrollToElement($element): void {
    $element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }
  ngOnInit(): void {
    
    this.getAllattributes()
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
  getAllattributes() {
    this.storeService.getItems(this.baseUrl).then(data => {
      this.dataSource.data = data.results
      this.filterAttr()
    })
  }

  filterAttr() {
    this.dataSource.data.forEach(el => {
      this.attributes = this.attributes.filter(item => item.value != el.name)
      console.log('test ', this.attributes)
    }) 
  }
  get f() {
    return this.attrForm.controls;
  }
  buildForm() {
    this.attrForm = this.formBuilder.group({
      nom: ['', Validators.required],
      type: ['', Validators.required],
      poids: ['', Validators.required],
      pourcentage: [''],
      url: ['']
    })
  }
  reset() {
    this.attrForm.reset()
    this.fTitle = 'Nouveau'
  }
  submit() {
    if (this.attrForm.invalid) { return }
    const attr = new ProviderAttribut()
    attr.name = this.f.nom.value
    attr.weight = this.f.poids.value
    attr.percentage = this.f.pourcentage.value
    attr.type = this.f.type.value
    attr.url = this.f.url.value
    console.warn('attr ', attr)
    if (this.isNew) {
      attr.percentage = 0
      this.create(attr)
    } else {
      this.update(attr)
    }
  }
  create(attr: ProviderAttribut) {
    this.storeService.setItem(attr, this.baseUrl).then(data => {
      this.spinner = false
      this.attrForm.reset()
    })
  }
  update(attr: ProviderAttribut) {
    this.storeService.updatItem(attr).then(data => {
      this.spinner = false
      this.attrForm.reset()
    })
  }
  edit(row: ProviderAttribut) {
    this.fTitle = 'Update'
    this.isNew = false
    this.f.nom.setValue(row.name)
    this.f.poids.setValue(row.weight)
    this.f.pourcentag.setValue(row.percentage)
    this.f.url.setValue(row.url)
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
