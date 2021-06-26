import { ThrowStmt } from '@angular/compiler';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Rule } from 'src/app/class/model';
import { StoreService } from 'src/app/service/store.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-regles',
  templateUrl: './regles.component.html',
  styleUrls: ['./regles.component.scss']
})
export class ReglesComponent implements OnInit, OnDestroy, AfterViewInit {

  reglForm: FormGroup
  dataSource = new MatTableDataSource<Rule>()
  fTitle = 'Nouveau'
  isNew = true
  url: string
  spinner = false
  baseUrl = environment.ruleEndpoint
  displayedColumns = ["name", "criticality", "complexity", "availability", "type", "action"]
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
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("profile-page");
    this.getAllRules()
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
  getAllRules() {
    this.storeService.getItems(this.baseUrl).then(data => {
      this.dataSource.data = data.results
    })
  }
  get f() {
    return this.reglForm.controls;
  }
  buildForm() {
    this.reglForm = this.formBuilder.group({
      nom: ['', Validators.required],
      criticite: ['', Validators.required],
      complexite: ['', Validators.required],
      disponibilite: ['', Validators.required],
      type: ['', Validators.required],
      url: ['']
    })
  }
  reset() {
    this.reglForm.reset()
    this.fTitle = 'Nouveau'
  }
  submit() {
    if (this.reglForm.invalid) { console.log(this.reglForm.getRawValue()); return }
    this.spinner = true
    const regle = new Rule()
    regle.name = this.f.nom.value
    regle.criticality = this.f.criticite.value
    regle.complexity = this.f.complexite.value
    regle.availability = this.f.disponibilite.value
    regle.type = this.f.type.value
    regle.url = this.f.url.value
    if (this.isNew) {
      this.create(regle)
    } else {
      this.update(regle)
    }
  }

  create(regle: Rule) {
    this.storeService.setItem(regle, this.baseUrl).then(data => {
      this.spinner = false
      this.reglForm.reset()
    })
  }

  update(regle: Rule) {
    this.storeService.updatItem(regle).then(data => {
      this.spinner = false
      this.reglForm.reset()
    })
  }

  edit(row: Rule) {
    this.fTitle = 'Update'
    this.isNew = false
    this.f.nom.setValue(row.name)
    this.f.criticite.setValue(row.criticality)
    this.f.complexite.setValue(row.complexity)
    this.f.disponibilite.setValue(row.availability)
    this.f.type.setValue(row.type)
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
