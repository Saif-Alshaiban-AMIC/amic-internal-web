import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDisk } from './service-disk';

describe('ServiceDisk', () => {
  let component: ServiceDisk;
  let fixture: ComponentFixture<ServiceDisk>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceDisk],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceDisk);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
