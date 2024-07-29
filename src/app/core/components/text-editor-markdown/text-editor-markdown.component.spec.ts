import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextEditorMarkdownComponent } from './text-editor-markdown.component';

describe('TextEditorMarkdownComponent', () => {
  let component: TextEditorMarkdownComponent;
  let fixture: ComponentFixture<TextEditorMarkdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextEditorMarkdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TextEditorMarkdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
