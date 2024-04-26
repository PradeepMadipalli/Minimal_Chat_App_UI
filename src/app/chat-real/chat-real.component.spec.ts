import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRealComponent } from './chat-real.component';

describe('ChatRealComponent', () => {
  let component: ChatRealComponent;
  let fixture: ComponentFixture<ChatRealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatRealComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatRealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
