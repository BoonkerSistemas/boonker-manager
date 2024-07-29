import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TextEditorComponent } from './text-editor.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AngularEditorModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  declarations: [TextEditorComponent],
  exports: [TextEditorComponent],
})
export class TextEditorModule {}
