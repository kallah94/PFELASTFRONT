import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttrProviderComponent } from './attr-provider.component';

describe('AttrProviderComponent', () => {
  let component: AttrProviderComponent;
  let fixture: ComponentFixture<AttrProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttrProviderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttrProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
