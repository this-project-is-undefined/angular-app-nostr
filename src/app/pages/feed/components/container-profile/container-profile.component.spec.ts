import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerProfileComponent } from './container-profile.component';

describe('ContainerProfileComponent', () => {
  let component: ContainerProfileComponent;
  let fixture: ComponentFixture<ContainerProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContainerProfileComponent]
    });
    fixture = TestBed.createComponent(ContainerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
