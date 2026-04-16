import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportantLinks } from './important-links';

describe('ImportantLinks', () => {
  let component: ImportantLinks;
  let fixture: ComponentFixture<ImportantLinks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportantLinks],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportantLinks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
