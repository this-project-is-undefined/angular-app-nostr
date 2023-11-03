import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerTopicsComponent } from './container-topics.component';

describe('ContainerProfileComponent', () => {
  let component: ContainerTopicsComponent;
  let fixture: ComponentFixture<ContainerTopicsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContainerTopicsComponent],
    });
    fixture = TestBed.createComponent(ContainerTopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
