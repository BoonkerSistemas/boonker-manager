import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndosoComponent } from './endoso.component';

describe('EndosoComponent', () => {
  let component: EndosoComponent;
  let fixture: ComponentFixture<EndosoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EndosoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EndosoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
