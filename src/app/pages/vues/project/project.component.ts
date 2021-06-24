import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER, N, SPACE, TAB } from '@angular/cdk/keycodes';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { Project } from 'src/app/class/model';
import { StoreService } from 'src/app/service/store.service';
import { environment } from 'src/environments/environment';

interface Env {
  value: string
  viewValue: string
}

interface TypeApp {
  value: string
  viewValue: string
}

interface Sla {
  value: number
  viewValue: string
}

interface Archi {
  value: string
  viewValue: string
}

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy, AfterViewInit {
  projectForm: FormGroup;
  dataSource = new MatTableDataSource<Project>()
  fTitle = "Nouveau"
  url = null
  isDelete = false
  isNew = true
  spinner = false
  baseUrl = environment.projectEndpoint
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA, TAB];
  fluxCtrl = new FormControl();
  depCrtl = new FormControl()
  filteredDep: Observable<string[]>
  filteredFlux: Observable<string[]>;
  dependencies: string[] = []
  flux: string[] = [];
  allDependencies: string[] = ['Mysql 7.2', 'MongoDB 1.4.5', 'Nginx 2.5', 'JavaFx 3.0.2']
  allFlux: string[] = ['OrangeMoney', 'Gaya', 'RGSystem', 'Nessico', 'kudo'];
  displayedColumns = ['name', 'architecture', 'type_application', 'environment', 'sla', 'dependencies', 'flux', 'dataSize', 'cost_estimation', 'action']
  environment: Env[] = [
    { value: 'development', viewValue: 'Developpement' },
    { value: 'test', viewValue: 'Test' },
    { value: 'production', viewValue: 'Production' }
  ]
  typeApp: TypeApp[] = [
    { value: 'mobile', viewValue: 'Mobile' },
    { value: 'desktop', viewValue: 'DeskTop' },
    { value: 'web', viewValue: 'Web' }
  ]
  SLA: Sla[] = [
    { value: 2, viewValue: '2H' },
    { value: 4, viewValue: '4H' },
    { value: 8, viewValue: '8H' },
    { value: 12, viewValue: '12H' },
    { value: 24, viewValue: '24H' }
  ]
  Archi: Archi[] = [
    { value: 'mono', viewValue: 'Monolithique' },
    { value: 'micro', viewValue: 'Microservices' }
  ]
  @ViewChild('myModal1', { static: false }) myModal1: ModalDirective
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('fluxInput') fluxInput: ElementRef<HTMLInputElement>;
  @ViewChild('depInput') depInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoDep') matAutocompleteDep: MatAutocomplete;
  @ViewChild('autoFlux') matAutocompleteFlux: MatAutocomplete;

  constructor(
    private storeService: StoreService,
    private formBuilder: FormBuilder
  ) {
    this.filteredFlux = this.fluxCtrl.valueChanges.pipe(
      startWith(null),
      map((flux: string | null) => flux ? this._filter(flux) : this.allFlux.slice()));
    this.filteredDep = this.depCrtl.valueChanges.pipe(
      startWith(null),
      map((dep: string | null) => dep ? this._filterDep(dep) : this.allDependencies.slice()))
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.flux.push(value);
    }
    this.fluxCtrl.setValue(null);
  }

  addDep(event: MatChipInputEvent): void {
    const value = (event.value || '').trim()
    if (value) {
      this.dependencies.push(value)
    }
    this.depCrtl.setValue(null)
  }

  remove(flu: string): void {
    const index = this.flux.indexOf(flu);
    if (index >= 0) {
      this.flux.splice(index, 1);
    }
  }

  removeDep(dep: string): void {
    const index = this.dependencies.indexOf(dep)
    if (index >= 0) {
      this.dependencies.splice(index, 1)
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.flux.push(event.option.viewValue);
    this.fluxInput.nativeElement.value = '';
    this.fluxCtrl.setValue(null);
  }

  selectedDep(event: MatAutocompleteSelectedEvent): void {
    this.dependencies.push(event.option.viewValue)
    this.depInput.nativeElement.value = ''
    this.depCrtl.setValue(null)
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFlux.filter(flu => flu.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterDep(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allDependencies.filter(dep => dep.toLowerCase().indexOf(filterValue) === 0);
  }



  scrollToElement($element): void {
    $element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }
  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("profile-page");
    this.getAllprojects()
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

  getAllprojects() {
    this.storeService.getItems(this.baseUrl).then(data => {
      this.dataSource.data = data.results
    })
  }
  get f() {
    return this.projectForm.controls;
  }
  buildForm() {
    this.projectForm = this.formBuilder.group({
      name: ['', Validators.required],
      architecture: ['', Validators.required],
      costEstimation: ['', Validators.required],
      typeApplication: ['', Validators.required],
      environment: ['', [Validators.required, Validators.max, Validators.min]],
      sla: ['', [Validators.required, Validators.max, Validators.min]],
      dependencies: [[], [Validators.required]],
      flux: [[], Validators.required],
      dataSize: ['', Validators.required],
      owner: ['', Validators.required],
      url: ['']
    })
  }
  reset() {
    this.projectForm.reset()
    this.f.flux.setValue(null)
    this.f.dependencies.setValue(null)
    this.flux = null
    this.dependencies = null
    this.fTitle = 'Nouveau'
  }
  submit() {
    this.f.flux.setValue(this.flux)
    this.f.dependencies.setValue(this.dependencies)
    if (this.projectForm.invalid) {
      return
    }
    this.spinner = true;
    const project = new Project()
    project.name = this.f.name.value
    project.architecture = this.f.architecture.value
    project.costEstimation = this.f.costEstimation.value
    project.type_application = this.f.typeApplication.value
    project.environment = this.f.environment.value
    project.sla = this.f.sla.value
    project.dependencies = this.f.dependencies.value
    project.flux = this.f.flux.value
    project.data_size = this.f.dataSize.value
    project.owner = this.f.owner.value
    project.url = this.f.url.value
    console.log(project)
    if (this.isNew) {
      this.create(project)
    } else {
      this.update(project)
    }
  }
  create(project: Project) {
    this.storeService.setItem(project, this.baseUrl).then(data => {
      this.spinner = true
      this.projectForm.reset()
    })
  }
  update(project: Project) {
    this.storeService.updatItem(project).then(data => { this.spinner = true; this.projectForm.reset() })
  }
  edit(row: Project) {
    this.fTitle = 'Update'
    this.isNew = false
    this.f.name.setValue(row.name)
    this.f.architecture.setValue(row.architecture)
    this.f.costEstimation.setValue(row.costEstimation)
    this.f.typeApplication.setValue(row.type_application)
    this.f.environment.setValue(row.environment)
    this.f.sla.setValue(row.sla)
    this.f.dependencies.setValue(row.dependencies)
    this.f.flux.setValue(row.flux)
    this.f.dataSize.setValue(row.data_size)
    this.f.owner.setValue(row.owner)
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
