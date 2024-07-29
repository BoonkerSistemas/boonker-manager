import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextEditorMarkdownComponent } from './text-editor-markdown.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';

@NgModule({
  declarations: [TextEditorMarkdownComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MarkdownModule.forRoot({
      markedOptions: {
        provide: MarkedOptions,
        useValue: {
          gfm: true,
          breaks: true,
        },
      },
    }),
    MatIconModule,
    MatTooltipModule,
    LMarkdownEditorModule,
  ],
  exports: [TextEditorMarkdownComponent],
})
export class TextEditorMarkdownModule {}
