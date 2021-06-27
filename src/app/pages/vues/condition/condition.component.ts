import { ViewChild } from '@angular/core';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Atom } from 'src/app/class/model';
import { StoreService } from 'src/app/service/store.service';
import { environment } from 'src/environments/environment';

interface CRITERE {
  value: string
  viewValue: string
}
interface FIELD {
  value: string
  viewValue: string
}
interface COMPARATOR {
  value: string
  viewValue: string
}
@Component({
  selector: 'app-condition',
  templateUrl: './condition.component.html',
  styleUrls: ['./condition.component.scss']
})
export class ConditionComponent implements OnInit, OnDestroy, AfterViewInit{
  atomForm: FormGroup
  conditions: FormArray
  fTitle = "Nouveau"
  isNew = true
  switcher = false
  url: string
  index = 0
  atoms: Atom[]
  spinner = false
  baseUrl = environment.atomEndpoint
  dataSource = new MatTableDataSource<Atom>()
  displayedColumns = ['champ', 'compare', 'seuil', 'valeur']
  criteres: CRITERE[] = [
    { value: 'criticality', viewValue: "Criticite" },
    { value: 'complexity', viewValue: "Complexite" },
    { value: 'availability', viewValue: 'Disponibilite' }
  ]
  definecriteres = this.criteres
  fields: FIELD[] = [
    { value: 'architecture', viewValue: 'Architecture' },
    { value: 'type_application', viewValue: 'Type Application' },
    { value: 'environment', viewValue: 'Environnement' },
    { value: 'sla', viewValue: 'SLA' },
    { value: 'dependencies', viewValue: 'Dependences' },
    { value: 'flux', viewValue: 'Flux' },
    { value: 'costEstimation', viewValue: 'Estimation Cout' },
    { value: 'data_size', viewValue: "taille des donnees" }
  ]
  comparators: COMPARATOR[] = [
    { value: '==', viewValue: "egale a" },
    { value: '<', viewValue: "inferieur a" }
  ]
  @ViewChild('myModal1', { static: false }) myModal1: ModalDirective
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private formBuilder: FormBuilder,
    private storeService: StoreService
  ) { }
  scrollToElement($element): void {
    $element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }

  ngOnInit(): void {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("profile-page");
    this.getAllAtoms()
    this.buildForm()
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getAllAtoms() {
    this.storeService.getItems(this.baseUrl).then(data => {
      this.atoms = data.results
      console.warn(this.atoms)
      this.filterCriteres()
    })
  }
  buildForm() {
    this.atomForm = this.formBuilder.group({
      critere: ['', Validators.required],
      conditions: this.formBuilder.array([this.createCond()]),
      url: ['']
    })
  }
  createCond(): FormGroup {
    return this.formBuilder.group({
      condField: new FormControl(''),
      condOp: new FormControl(''),
      condSeuil: new FormControl(''),
      condValue: new FormControl('')
    })
  }
  
  addCond() {
    const conditions = this.atomForm.get('conditions') as FormArray
    conditions.push(this.createCond())
  }
  getControles() {
    return (this.atomForm.get('conditions') as FormArray).controls
  }
  get f() {
    return this.atomForm.controls
  }
  removeCond(index: number) {
    const conditions = this.atomForm.get('conditions') as FormArray
    conditions.removeAt(index)
  }
  filterCriteres() {
    this.atoms.forEach(atom => {
      this.criteres = this.criteres.filter(item => item.value != atom.criteria)
    })
  }
  submit() {
    if (this.atomForm.invalid) { return }
    const atom = new Atom()
    atom.criteria = this.f.critere.value
    atom.condition = this.f.conditions.value
    atom.url = this.f.url.value
    if (this.isNew) {
      this.create(atom)
    } else {
      this.update(atom)
    }
    this.ngOnInit()
  }
  create(atom: Atom) {
    this.storeService.setItem(atom, this.baseUrl).then(data => {
      this.spinner = false
      this.atomForm.reset()
      this.ngOnInit()
    })
  }
  update(atom: Atom) {
    this.storeService.updatItem(atom).then(data => {
      this.spinner = false
      this.atomForm.reset()
      this.ngOnInit()
    })
  }
  edit(row: Atom) {
    console.warn('atom ', row)
    this.fTitle = "Update"
    this.isNew = false
    this.f.url.setValue(row.url)
    this.f.critere.setValue(row.criteria)
    this.criteres.push(this.definecriteres.find(item => item.value == row.criteria));
    row.condition.forEach(() => {
      this.index = this.index + 1;
      (<FormArray>this.atomForm.controls['conditions']).patchValue(row.condition);
      this.addCond();
    });
    this.removeCond(this.index)
    this.index = 0
    this.scrollToElement(document.getElementById("form2"))
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

  reset() {
    this.atomForm.reset()
  }

  makeDataSource(atom: Atom) {
    const dataSource = new MatTableDataSource<Atom>()
    dataSource.data = atom.condition
    return dataSource
  }
  getOpLabel(value: string): string {
    return this.comparators.find(comp => comp.value == value).viewValue
  }
 
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("profile-page");
  }
}
