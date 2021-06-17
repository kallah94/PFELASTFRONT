import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Provider } from 'src/app/class/model';
import { StoreService } from 'src/app/service/store.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.scss']
})
export class ProviderComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  provForm: FormGroup;
  fTitle = "Nouveau"
  spinner = false;
  baseUrl = environment.providerEndpoint
  constructor(
    private storeService: StoreService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("profile-page");
    this.getAllproviders()
    this.buildForm()
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("profile-page");
  }

  getAllproviders() {
    console.log(this.baseUrl)
    this.storeService.getItems(this.baseUrl).then(data => {
      console.log(data.results)
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
      price: ['', [Validators.required, Validators.max, Validators.min]]
    })
  }

  reset() {
    this.provForm.reset()
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
    prov.url = ''

    this.storeService.setItem(prov, this.baseUrl).then( data => {
      this.spinner = false;
      this.provForm.reset()
    })

  }
}
